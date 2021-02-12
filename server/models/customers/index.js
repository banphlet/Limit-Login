'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'

const Model = mongoose.models.Customer || mongoose.model('Customer', schema)
const CustomerModal = BaseModel(Model)

const customErrorMessage = 'customer does not exist'

/**
 * Update or create by email
 */
const create = (payload = required('payload')) =>
  CustomerModal.create({
    data: payload
  })

const getByEmail = (
  email = required('email'),
  errMessage = customErrorMessage
) =>
  CustomerModal.ensureExists({
    query: {
      email
    },
    customErrorMessage: errMessage
  })

const getById = (id = required('id')) =>
  CustomerModal.ensureExists({
    query: {
      _id: id
    },
    customErrorMessage
  })

const updateById = (id, update) =>
  CustomerModal.updateOne({
    query: {
      _id: id
    },
    update
  })

const fetchByShopId = shopId =>
  CustomerModal.fetch({
    query: {
      shop: shopId
    },
    select: '-access_token'
  })

const getBasedOnCriteria = ({ shopId = required('shopId'), field, value }) =>
  CustomerModal.get({
    query: {
      shop: shopId,
      [field]: value
    }
  })

const createOrUpdate = ({ shopId = required('shopId'), ip, email }) =>
  CustomerModal.upsert({
    query: {
      shop: shopId,
      $or: [{ ip }, { email }]
    },
    update: {
      ip,
      shop: shopId,
      email,
      $inc: { attempts: 1 }
    }
  })

export default () => ({
  ...CustomerModal,
  createOrUpdate,
  create,
  getByEmail,
  getById,
  updateById,
  fetchByShopId,
  getBasedOnCriteria
})
