'use strict'
import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { SocialPlatforms } from '../../../models/shops/schema'
import socialPlatforms from '../../social-platforms'
import { socialAccount } from '../../../models'

const schema = joi.object({
  access_token: joi.string(),
  external_id: joi.string().required(),
  name: joi.string(),
  handle: joi.string(),
  shop_id: objectId().required(),
  platform: joi
    .string()
    .valid(...Object.values(SocialPlatforms))
    .required(),
  catalogs: joi.array().items(
    joi.object({
      id: joi.string().required()
    })
  )
})

export async function addOrUpdateSocialAccount (payload) {
  const validated = validate(schema, payload)
  const { shop_id: shopId, ...transformedPayload } = await socialPlatforms(
    validated.platform
  ).transformConnectPayload(validated)
  return socialAccount().upsertByExternalIdPlatformAndShopId(
    {
      externalId: transformedPayload.external_id,
      shopId: shopId,
      platform: transformedPayload.platform
    },
    {
      shop: shopId,
      ...transformedPayload
    }
  )
}
