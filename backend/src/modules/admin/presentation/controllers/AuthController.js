// backend/src/modules/auth/presentation/controllers/AuthController.js

class AuthController {
  constructor(loginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Execute login use case
      const result = await this.loginUserUseCase.execute(email, password);

      // Return token dan user data
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Error in login:', error);
      
      // Return 401 untuk auth error
      const statusCode = error.message.includes('not found') || 
                        error.message.includes('Invalid') || 
                        error.message.includes('disabled') ? 401 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AuthController;