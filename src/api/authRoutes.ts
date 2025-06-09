import express from 'express';

const router = express.Router();

const authRoutes = (authController:any) => {
  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));
  router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
  router.post('/reset-password', (req, res) => authController.resetPassword(req, res));
  return router;
};

export default authRoutes;
