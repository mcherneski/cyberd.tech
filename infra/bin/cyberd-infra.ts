#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PortfolioStack } from "../lib/portfolio-stack.js";

const app = new cdk.App();

const domainName = app.node.tryGetContext("domainName") ?? process.env.DOMAIN_NAME;
const hostedZoneId = app.node.tryGetContext("hostedZoneId") ?? process.env.HOSTED_ZONE_ID;
const hostedZoneName = app.node.tryGetContext("hostedZoneName") ?? process.env.HOSTED_ZONE_NAME;
const contactToAddress = app.node.tryGetContext("contactToAddress") ?? process.env.CONTACT_TO_ADDRESS;
const contactFromAddress = app.node.tryGetContext("contactFromAddress") ?? process.env.CONTACT_FROM_ADDRESS;
const turnstileSiteverifyUrl =
  app.node.tryGetContext("turnstileSiteverifyUrl") ?? process.env.TURNSTILE_SITEVERIFY_URL;
const turnstileSecretParameterName =
  app.node.tryGetContext("turnstileSecretParameterName") ?? process.env.TURNSTILE_SECRET_PARAMETER;
const socialLinkedinUrl = app.node.tryGetContext("socialLinkedinUrl") ?? process.env.SOCIAL_LINKEDIN_URL;
const socialXUrl = app.node.tryGetContext("socialXUrl") ?? process.env.SOCIAL_X_URL;
const socialTelegramUrl = app.node.tryGetContext("socialTelegramUrl") ?? process.env.SOCIAL_TELEGRAM_URL;

new PortfolioStack(app, "CyberdPortfolioStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  },
  domainName,
  hostedZoneId,
  hostedZoneName,
  contactToAddress,
  contactFromAddress,
  turnstileSiteverifyUrl,
  turnstileSecretParameterName,
  socialLinkedinUrl,
  socialXUrl,
  socialTelegramUrl,
});
