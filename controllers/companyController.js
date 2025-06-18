const knex = require('../config/database');

const companyController = {
    // Register a new company
    async register(req, res) {
        try {
            const {
                name,
                email,
                phone,
                logo,
                district,
                sector,
                cell,
                village,
                street,
                amount_per_month
            } = req.body;

            // Validate required fields
            if (!name || !email || !phone || !district || !sector || !cell || !village || !street || !amount_per_month) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check if company with email already exists
            const existingCompany = await knex('companies').where({ email }).first();
            if (existingCompany) {
                return res.status(400).json({ error: 'Company with this email already exists' });
            }

            // Insert new company
            const [companyId] = await knex('companies').insert({
                name,
                email,
                phone,
                logo,
                district,
                sector,
                cell,
                village,
                street,
                amount_per_month
            });

            const newCompany = await knex('companies').where({ id: companyId }).first();
            
            return res.status(201).json({
                message: 'Company registered successfully',
                company: newCompany
            });
        } catch (error) {
            console.error('Error registering company:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get all companies
    async getAllCompanies(req, res) {
        try {
            const companies = await knex('companies').select('*');
            return res.json(companies);
        } catch (error) {
            console.error('Error fetching companies:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get company by ID
    async getCompanyById(req, res) {
        try {
            const { id } = req.params;
            const company = await knex('companies').where({ id }).first();
            
            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }

            return res.json(company);
        } catch (error) {
            console.error('Error fetching company:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = companyController; 