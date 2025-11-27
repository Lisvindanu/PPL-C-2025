const Email = require('../../domain/value-objects/Email');
const { OAuth2Client } = require('google-auth-library');

class LoginWithGoogle {
  constructor({ userRepository, jwtService }) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async execute({ idToken, accessToken }) {
    if (!idToken && !accessToken) {
      const error = new Error('Google ID token or access token is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      let payload;
      let googleId;
      let email;
      let firstName;
      let lastName;
      let avatar;

      if (idToken) {
        // Verify the Google ID token
        const ticket = await this.client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
        googleId = payload.sub;
        email = payload.email;
        firstName = payload.given_name;
        lastName = payload.family_name;
        avatar = payload.picture;
      } else if (accessToken) {
        // Get user info from Google using access token
        const axios = require('axios');
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userInfo = userInfoResponse.data;
        // For access token, we'll use email as identifier since we don't have sub
        email = userInfo.email;
        googleId = userInfo.sub || userInfo.id || null;
        firstName = userInfo.given_name;
        lastName = userInfo.family_name;
        avatar = userInfo.picture;
      }

      if (!email) {
        const error = new Error('Email not provided by Google');
        error.statusCode = 400;
        throw error;
      }

      // Check if user exists by google_id (if we have it)
      let user = null;
      if (googleId) {
        user = await this.userRepository.findByGoogleId(googleId);
      }

      // If not found by google_id, check by email (for users who registered with email then linked Google)
      if (!user) {
        user = await this.userRepository.findByEmail(email);
        if (user && googleId) {
          // Link Google account to existing user
          await user.update({ google_id: googleId });
        }
      }

      // If user still doesn't exist, this is a registration flow
      if (!user) {
        const error = new Error('User not found. Please register first.');
        error.statusCode = 404;
        throw error;
      }

      // Generate JWT token
      const token = this.jwtService.generate(user.id, user.role);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const err = new Error(`Google authentication failed: ${error.message}`);
      err.statusCode = 401;
      throw err;
    }
  }
}

module.exports = LoginWithGoogle;

