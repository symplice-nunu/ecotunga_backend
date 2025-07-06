const db = require('../config/db');

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
                amount_per_month,
                ubudehe_category,
                gender,
                last_name,
                website
            } = req.body;

            // Validate required fields
            if (!name || !email || !phone || !district || !sector || !cell || !village || !street || !amount_per_month) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check if company with email already exists
            const existingCompany = await db('companies').where({ email }).first();
            if (existingCompany) {
                return res.status(400).json({ error: 'Company with this email already exists' });
            }

            // Insert new company
            const [companyId] = await db('companies').insert({
                name,
                email,
                phone,
                logo,
                district,
                sector,
                cell,
                village,
                street,
                amount_per_month,
                ubudehe_category,
                gender,
                last_name,
                website
            });

            const newCompany = await db('companies').where({ id: companyId }).first();
            
            return res.status(201).json({
                message: 'Company registered successfully',
                company: newCompany
            });
        } catch (error) {
            console.error('Error registering company:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update company by email
    async updateByEmail(req, res) {
        try {
            const { 
                email, 
                phone, 
                district, 
                sector, 
                cell, 
                village, 
                street, 
                amount_per_month,
                ubudehe_category,
                gender,
                last_name,
                website,
                waste_types
            } = req.body;

            // Check if company exists
            const existingCompany = await db('companies').where({ email }).first();
            if (!existingCompany) {
                return res.status(404).json({ error: 'Company not found' });
            }

            // Prepare update data
            const updateData = {
                phone: phone || existingCompany.phone,
                district: district || existingCompany.district,
                sector: sector || existingCompany.sector,
                cell: cell || existingCompany.cell,
                village: village || existingCompany.village,
                street: street || existingCompany.street,
                amount_per_month: amount_per_month || existingCompany.amount_per_month,
                ubudehe_category: ubudehe_category || existingCompany.ubudehe_category,
                gender: gender || existingCompany.gender,
                last_name: last_name || existingCompany.last_name,
                website: website !== undefined ? website : existingCompany.website,
                updated_at: db.fn.now()
            };

            // Add waste_types if provided
            if (waste_types !== undefined) {
                updateData.waste_types = JSON.stringify(waste_types);
            }

            // Update company information
            await db('companies')
                .where({ email })
                .update(updateData);

            // If waste_types were updated, also update the corresponding user record
            if (waste_types !== undefined) {
                try {
                    await db('users')
                        .where({ email })
                        .update({
                            waste_types: JSON.stringify(waste_types),
                            updated_at: db.fn.now()
                        });
                } catch (userError) {
                    console.error('Error updating user waste types:', userError);
                    // Don't fail the company update if user update fails
                }
            }

            const updatedCompany = await db('companies').where({ email }).first();
            
            return res.json({
                message: 'Company updated successfully',
                company: updatedCompany
            });
        } catch (error) {
            console.error('Error updating company:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update company profile (for waste collectors and recycling centers)
    async updateProfile(req, res) {
        try {
            // Get user email from database using user ID from JWT token
            const user = await db('users').where({ id: req.user.id }).select('email').first();
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            const userEmail = user.email;
            const {
                phone,
                district,
                sector,
                cell,
                village,
                street,
                amount_per_month,
                ubudehe_category,
                gender,
                last_name,
                waste_types
            } = req.body;

            // Check if company exists
            const existingCompany = await db('companies').where({ email: userEmail }).first();
            if (!existingCompany) {
                return res.status(404).json({ error: 'Company not found' });
            }

            // Prepare update data
            const updateData = {
                phone: phone || existingCompany.phone,
                district: district || existingCompany.district,
                sector: sector || existingCompany.sector,
                cell: cell || existingCompany.cell,
                village: village || existingCompany.village,
                street: street || existingCompany.street,
                amount_per_month: amount_per_month || existingCompany.amount_per_month,
                ubudehe_category: ubudehe_category || existingCompany.ubudehe_category,
                gender: gender || existingCompany.gender,
                last_name: last_name || existingCompany.last_name,
                website: req.body.website !== undefined ? req.body.website : existingCompany.website,
                updated_at: db.fn.now()
            };

            // Add waste_types if provided
            if (waste_types !== undefined) {
                updateData.waste_types = JSON.stringify(waste_types);
            }

            // Update company information
            await db('companies')
                .where({ email: userEmail })
                .update(updateData);

            // If waste_types were updated, also update the corresponding user record
            if (waste_types !== undefined) {
                try {
                    await db('users')
                        .where({ email: userEmail })
                        .update({
                            waste_types: JSON.stringify(waste_types),
                            updated_at: db.fn.now()
                        });
                } catch (userError) {
                    console.error('Error updating user waste types:', userError);
                    // Don't fail the company update if user update fails
                }
            }

            const updatedCompany = await db('companies').where({ email: userEmail }).first();
            
            return res.json({
                message: 'Company profile updated successfully',
                company: updatedCompany
            });
        } catch (error) {
            console.error('Error updating company profile:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get company profile (for waste collectors and recycling centers)
    async getProfile(req, res) {
        try {
            // Get user email from database using user ID from JWT token
            const user = await db('users').where({ id: req.user.id }).select('email').first();
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            const userEmail = user.email;
            
            const company = await db('companies').where({ email: userEmail }).first();
            
            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }

            return res.json(company);
        } catch (error) {
            console.error('Error fetching company profile:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get all companies
    async getAllCompanies(req, res) {
        try {
            const companies = await db('companies').select('*');
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
            const company = await db('companies').where({ id }).first();
            
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