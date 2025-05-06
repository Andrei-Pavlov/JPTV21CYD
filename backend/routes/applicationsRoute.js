// routes/applications.js
import express from 'express';
import upload from '../middleware/upload.js';
import { 
    createApplication, 
    getApplications, 
    updateApplication, 
    deleteApplication,
    acceptApplication,
    declineApplication
} from '../controllers/applicationsController.js';

const applicationsrouter = express.Router();

// applicationsrouter.post('/', createApplication);
// applicationsrouter.post('/', upload.single('photo'), createApplication);
// applicationsrouter.get('/', getApplications);
// applicationsrouter.patch('/:id', updateApplication);
// applicationsrouter.patch('/accept/:id', acceptApplication);
// applicationsrouter.patch('/decline/:id', declineApplication);
// applicationsrouter.delete('/delete/:id', deleteApplication);
applicationsrouter.post('/', upload.single('photo'), createApplication);

applicationsrouter.get('/', getApplications);
applicationsrouter.patch('/:id', updateApplication);
applicationsrouter.patch('/accept/:id', acceptApplication);
applicationsrouter.patch('/decline/:id', declineApplication);
applicationsrouter.delete('/delete/:id', deleteApplication);


export default applicationsrouter;
