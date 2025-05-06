
import Applications from '../models/applications.js';

export const createApplication = async (req, res) => {
    const { name, email, letter} = req.body;
    const photo = req.file ? req.file.filename : null; // multer кладет файл в req.file
    try {
        const newApplication = await Applications.create({
            name,
            email,
            letter,
            photo
        });
        res.status(201).json(newApplication);
    } catch (error) {
        console.error('Ошибка Sequelize при создании заявки:\n', error); // ПОЛНАЯ ОШИБКА!
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email уже существует' });
        }
        
        res.status(500).json({ message: 'Ошибка создания заявки', error: error.message });
    }
};
export const getApplications = async (req, res) => {
    try {
        const applications = await Applications.findAll();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Applications.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedApplication = await Applications.findOne({ where: { id: id } });
            res.status(200).json(updatedApplication);
        }
        throw new Error('Application not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        await Applications.destroy({
            where: {
                id: req.params.id,
            }
        })
        res.json({
            message: 'Заявка отклонена'
        })
    }   catch (error) {
        res.json({message: error.message})
    }
}

export const acceptApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Applications.findOne({ where: { id: id } });
        if (application) {
            application.isAccepted = 1;
            await application.save();
            res.status(200).json(application);
        } else {
            throw new Error('Application not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Обрабатываем ошибку и отправляем обратно клиенту
    }
};
export const declineApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Applications.findOne({ where: { id: id } });
        if (application) {
            application.isAccepted = 2;
            await application.save();
            res.status(200).json(application);
        } else {
            throw new Error('Application not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Обрабатываем ошибку и отправляем обратно клиенту
    }
};
