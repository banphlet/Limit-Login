'use strict'
import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { shops as shopModel } from '../../../models'
import { LimitBy } from '../../../models/shops/schema'

const schema = joi.object({
  shop_id: objectId().required(),
  limit_by: joi.string().valid(...Object.values(LimitBy)),
  attempts: joi.number()
})

export const updateShopById = async payload => {
  const validated = validate(schema, payload)

  const {
    external_access_token,
    __v,
    _id,
    ...shop
  } = await shopModel().updateById(validated.shop_id, validated)
  return shop
}
