'use strict'

import joi from '../../lib/joi'
import { validate } from '../../lib/utils'
import { Platforms } from '../../models/shops/schema'
import platforms from '../platforms'
import { shops as shopModel } from '../../models'

const schema = joi.object({
  code: joi.string().required(),
  platform: joi
    .string()
    .valid(...Object.values(Platforms))
    .required(),
  shop: joi.string()
})

const getTokens = ({ platform, ...rest }) =>
  platforms(platform).getOauthAccessTokens(rest)

export default async function installShop (payload) {
  const validated = validate(schema, payload)

  const tokens = await getTokens(validated)
  const shopDetails = await platforms(validated.platform).getSiteDetails({
    ...tokens,
    ...validated
  })
  const shop = await shopModel().upsertByPlatformDomainOrExternalId(
    {
      platformDomain: shopDetails.platformDomain,
      externalId: shopDetails.externalId
    },
    {
      domain: shopDetails.domain,
      external_id: shopDetails.externalId,
      name: shopDetails.name,
      email: shopDetails.email,
      external_access_token: tokens.accessToken,
      platform: validated.platform,
      locale: shopDetails.locale,
      platform_domain: shopDetails.platformDomain
    }
  )

  await platforms(validated.platform).injectScript({
    accessToken: tokens.accessToken,
    platformDomain: shopDetails.platformDomain,
    shopId: shop.id
  })

  return {
    url: '/',
    shop
  }
}
