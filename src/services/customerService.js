const { Op } = require('sequelize');
const { Customer } = require('../models');
const logger = require('../lib/logger');

function makeHttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Telefonu TR için normalize eder: +905XXXXXXXXX
function normalizeTRPhone(input) {
  if (!input) return null;
  let s = String(input).trim();
  s = s.replace(/[^\d]/g, ''); // sadece rakam bırak
  if (!s) return null;

  if (s.startsWith('00')) s = s.slice(2);

  // 0XXXXXXXXXX (11 hane) => +90XXXXXXXXXX
  if (s.startsWith('0') && s.length === 11) return '+9' + s;

  // 90XXXXXXXXXX (12 hane) => +90XXXXXXXXXX
  if (s.startsWith('90') && s.length === 12) return '+' + s;

  // XXXXXXXXXX (10 hane) => +90XXXXXXXXXX
  if (s.length === 10) return '+90' + s;

  // diğerleri geçersiz kabul
  return null;
}

// Basit email validasyon + normalize
function normalizeEmail(input) {
  if (!input) return null;
  const s = String(input).trim().toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  return ok ? s : null;
}

// Moha: Müşteri listesini sayfalama ve arama ile döndürür.
async function listCustomers({ page = 1, pageSize = 20, search = '' } = {}) {
  const offset = (page - 1) * pageSize;
  const where = {};
  if (search) {
    const like = { [Op.iLike]: `%${search}%` };
    where[Op.or] = [
      { firstName: like },
      { lastName: like },
      { email: like },
      { phone: like }
    ];
  }
  const { rows, count } = await Customer.findAndCountAll({
    where,
    limit: pageSize,
    offset,
    order: [['id', 'ASC']]
  });
  return { data: rows, total: count, page, pageSize };
}

async function getCustomerById(id) {
  return Customer.findByPk(id);
}

async function createCustomer(payload) {
  const firstName = (payload.firstName || payload.first_name || '').trim();
  if (!firstName) throw makeHttpError(400, 'firstName is required');

  const lastName = payload.lastName ? String(payload.lastName).trim() : null;
  const phone = normalizeTRPhone(payload.phone);
  const email = normalizeEmail(payload.email);

  // Duplicate kuralı:
  // phone varsa phone ile engelle, phone yoksa email ile engelle
  if (phone) {
    const existing = await Customer.findOne({ where: { phone } });
    if (existing) throw makeHttpError(409, 'Customer with same phone already exists');
  } else if (email) {
    const existing = await Customer.findOne({ where: { email } });
    if (existing) throw makeHttpError(409, 'Customer with same email already exists');
  }

  // Adres zorunluluğu (Kargo için gerekliyse - iş kuralı olarak ekliyoruz)
  // Not: Burada kargo zorunluluğu gibi bir flag olsaydı ona göre kontrol ederdik.
  // Şimdilik sadece normalize ediyoruz.

  // Hassas: tüm payload'ı loglama (PII). Sadece alan adları veya id logla.
  logger.info('Creating customer', { firstName, hasPhone: !!phone, hasEmail: !!email });

  return Customer.create({
    firstName,
    lastName,
    phone,
    email,
    address: payload.address ? String(payload.address).trim() : null,
    note: payload.note ? String(payload.note).trim() : null
  });
}

async function updateCustomer(id, payload) {
  const customer = await Customer.findByPk(id);
  if (!customer) return null;

  const firstName = (payload.firstName ?? customer.firstName ?? '').trim();
  if (!firstName) throw makeHttpError(400, 'firstName is required');

  const lastName = payload.lastName !== undefined
    ? (payload.lastName ? String(payload.lastName).trim() : null)
    : customer.lastName;

  const phone = payload.phone !== undefined ? normalizeTRPhone(payload.phone) : customer.phone;
  const email = payload.email !== undefined ? normalizeEmail(payload.email) : customer.email;

  // Duplicate kontrol (kendisi hariç)
  if (phone) {
    const existing = await Customer.findOne({
      where: { phone, id: { [Op.ne]: customer.id } }
    });
    if (existing) throw makeHttpError(409, 'Another customer with same phone already exists');
  } else if (email) {
    const existing = await Customer.findOne({
      where: { email, id: { [Op.ne]: customer.id } }
    });
    if (existing) throw makeHttpError(409, 'Another customer with same email already exists');
  }

  logger.info('Updating customer', { id: customer.id });

  await customer.update({
    firstName,
    lastName,
    phone,
    email,
    address: payload.address !== undefined ? (payload.address ? String(payload.address).trim() : null) : customer.address,
    note: payload.note !== undefined ? (payload.note ? String(payload.note).trim() : null) : customer.note
  });

  return customer;
}

async function deleteCustomer(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) return false;

  logger.info('Deleting customer', { id: customer.id });
  await customer.destroy();
  return true;
}

module.exports = {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  normalizeTRPhone,
  normalizeEmail
};
