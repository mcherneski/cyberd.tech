import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface PortfolioStackProps extends cdk.StackProps {
  domainName?: string;
  hostedZoneId?: string;
  hostedZoneName?: string;
  contactToAddress?: string;
  contactFromAddress?: string;
  turnstileSiteverifyUrl?: string;
  turnstileSecretKey?: string;
  socialLinkedinUrl?: string;
  socialXUrl?: string;
  socialTelegramUrl?: string;
}

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PortfolioStackProps = {}) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const rewriteFunction = new cloudfront.Function(this, "CleanUrlRewrite", {
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.includes('.')) {
    request.uri = uri + '/index.html';
  }
  return request;
}
      `.trim()),
    });

    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, "SecurityHeaders", {
      securityHeadersBehavior: {
        contentSecurityPolicy: {
          contentSecurityPolicy:
            "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https:; frame-src https://challenges.cloudflare.com; form-action 'self' https:; frame-ancestors 'none'; base-uri 'self'",
          override: true,
        },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: { referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN, override: true },
        strictTransportSecurity: {
          accessControlMaxAge: cdk.Duration.days(365),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        xssProtection: { protection: true, modeBlock: true, override: true },
      },
    });

    let certificate: acm.ICertificate | undefined;
    let hostedZone: route53.IHostedZone | undefined;

    if (props.domainName && props.hostedZoneId && props.hostedZoneName) {
      hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
        hostedZoneId: props.hostedZoneId,
        zoneName: props.hostedZoneName,
      });

      certificate = new acm.Certificate(this, "SiteCertificate", {
        domainName: props.domainName,
        subjectAlternativeNames: [`www.${props.domainName}`],
        validation: acm.CertificateValidation.fromDns(hostedZone),
      });
    }

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      certificate,
      domainNames: props.domainName ? [props.domainName, `www.${props.domainName}`] : undefined,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        responseHeadersPolicy,
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: rewriteFunction,
          },
        ],
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    if (hostedZone && props.domainName) {
      new route53.ARecord(this, "ApexAlias", {
        zone: hostedZone,
        recordName: props.domainName,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      });

      new route53.ARecord(this, "WwwAlias", {
        zone: hostedZone,
        recordName: `www.${props.domainName}`,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      });
    }

    const allowedOrigin = props.domainName ? `https://${props.domainName}` : "*";
    const contactHandler = new NodejsFunction(this, "ContactHandler", {
      entry: path.join(__dirname, "../lambda/contact-handler.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        ALLOWED_ORIGIN: allowedOrigin,
        CONTACT_TO_ADDRESS: props.contactToAddress ?? "",
        CONTACT_FROM_ADDRESS: props.contactFromAddress ?? "",
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    if (props.contactFromAddress) {
      contactHandler.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: [`arn:${cdk.Aws.PARTITION}:ses:${this.region}:${this.account}:identity/${props.contactFromAddress}`],
        }),
      );
    }

    const contactApi = new apigwv2.HttpApi(this, "ContactApi", {
      corsPreflight: {
        allowOrigins: [allowedOrigin],
        allowMethods: [apigwv2.CorsHttpMethod.OPTIONS, apigwv2.CorsHttpMethod.POST],
        allowHeaders: ["Content-Type"],
        maxAge: cdk.Duration.days(1),
      },
    });

    contactApi.addRoutes({
      path: "/contact",
      methods: [apigwv2.HttpMethod.POST, apigwv2.HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration("ContactIntegration", contactHandler),
    });

    const socialLinksHandler = new NodejsFunction(this, "SocialLinksHandler", {
      entry: path.join(__dirname, "../lambda/social-links-handler.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        ALLOWED_ORIGIN: allowedOrigin,
        TURNSTILE_SITEVERIFY_URL: props.turnstileSiteverifyUrl ?? "",
        TURNSTILE_SECRET_KEY: props.turnstileSecretKey ?? "",
        SOCIAL_LINKEDIN_URL: props.socialLinkedinUrl ?? "",
        SOCIAL_X_URL: props.socialXUrl ?? "",
        SOCIAL_TELEGRAM_URL: props.socialTelegramUrl ?? "",
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    contactApi.addRoutes({
      path: "/social-links",
      methods: [apigwv2.HttpMethod.POST, apigwv2.HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration("SocialLinksIntegration", socialLinksHandler),
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset(path.join(__dirname, "../../web/dist"))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
      prune: true,
      cacheControl: [s3deploy.CacheControl.fromString("public,max-age=60,must-revalidate")],
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, "SiteBucketName", {
      value: siteBucket.bucketName,
    });
    new cdk.CfnOutput(this, "ContactApiUrl", {
      value: `${contactApi.apiEndpoint}/contact`,
    });
    new cdk.CfnOutput(this, "SocialApiUrl", {
      value: `${contactApi.apiEndpoint}/social-links`,
    });
  }
}
