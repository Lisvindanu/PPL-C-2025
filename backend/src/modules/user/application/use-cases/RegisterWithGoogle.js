const Email = require('../../domain/value-objects/Email');
const { OAuth2Client } = require('google-auth-library');

class RegisterWithGoogle {
  constructor({ userRepository, jwtService, emailService }) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.emailService = emailService;
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async execute({ idToken, accessToken, role = 'client' }) {
    if (!idToken && !accessToken) {
      const error = new Error('Google ID token or access token is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      let googleId;
      let email;
      let firstName;
      let lastName;
      let avatar;
      let email_verified;

      if (idToken) {
        // Verify the Google ID token
        const ticket = await this.client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        googleId = payload.sub;
        email = payload.email;
        firstName = payload.given_name;
        lastName = payload.family_name;
        avatar = payload.picture;
        email_verified = payload.email_verified;
      } else if (accessToken) {
        // Get user info from Google using access token
        const axios = require('axios');
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userInfo = userInfoResponse.data;
        email = userInfo.email;
        googleId = userInfo.sub || userInfo.id || null;
        firstName = userInfo.given_name;
        lastName = userInfo.family_name;
        avatar = userInfo.picture;
        email_verified = userInfo.email_verified || true; // Assume verified if using OAuth
      }

      if (!email) {
        const error = new Error('Email not provided by Google');
        error.statusCode = 400;
        throw error;
      }

      const emailVo = new Email(email);

      // Check if user already exists
      if (googleId) {
        const existingByGoogleId = await this.userRepository.findByGoogleId(googleId);
        if (existingByGoogleId) {
          const error = new Error('User already registered with this Google account');
          error.statusCode = 409;
          throw error;
        }
      }

      const existingByEmail = await this.userRepository.findByEmail(emailVo.value);
      if (existingByEmail) {
        const error = new Error('Email already registered. Please login instead.');
        error.statusCode = 409;
        throw error;
      }

      // Create new user
      const created = await this.userRepository.create({
        email: emailVo.value,
        password: null, // OAuth users don't have passwords
        google_id: googleId,
        role: role === 'freelancer' ? 'freelancer' : 'client',
        nama_depan: firstName || null,
        nama_belakang: lastName || null,
        avatar: avatar || null,
        is_verified: email_verified || false,
        email_verified_at: email_verified ? new Date() : null
      });

      // Generate JWT token
      const token = this.jwtService.generate(created.id, created.role);

      return {
        token,
        user: {
          id: created.id,
          email: created.email,
          role: created.role
        },
        message: 'Registration successful with Google'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const err = new Error(`Google registration failed: ${error.message}`);
      err.statusCode = 400;
      throw err;
    }
  }
}

module.exports = RegisterWithGoogle;

