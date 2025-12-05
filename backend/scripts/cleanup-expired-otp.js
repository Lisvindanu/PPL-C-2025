/**
 * Cleanup Expired OTP Tokens
 * 
 * This script removes expired OTP tokens from the database.
 * Can be run manually or scheduled via cron job.
 * 
 * Usage:
 *   node scripts/cleanup-expired-otp.js
 * 
 * Cron example (run daily at 2 AM):
 *   0 2 * * * cd /path/to/backend && node scripts/cleanup-expired-otp.js
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

async function cleanupExpiredTokens() {
  try {
    log('Starting OTP token cleanup...', 'cyan');

    // Test database connection
    await sequelize.authenticate();
    log('✅ Database connection established', 'green');

    // Get count of expired tokens before cleanup
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM user_tokens 
      WHERE expires_at < NOW()
    `);
    const expiredCount = countResult[0].count;

    if (expiredCount === 0) {
      log('No expired tokens found', 'yellow');
      return { deleted: 0, message: 'No expired tokens' };
    }

    log(`Found ${expiredCount} expired tokens`, 'yellow');

    // Delete expired tokens
    const [result] = await sequelize.query(`
      DELETE FROM user_tokens 
      WHERE expires_at < NOW()
    `);

    const deletedCount = result.affectedRows || 0;
    log(`✅ Deleted ${deletedCount} expired tokens`, 'green');

    // Get statistics
    const [statsResult] = await sequelize.query(`
      SELECT 
        type,
        COUNT(*) as count,
        SUM(CASE WHEN used_at IS NOT NULL THEN 1 ELSE 0 END) as used_count,
        SUM(CASE WHEN used_at IS NULL THEN 1 ELSE 0 END) as unused_count
      FROM user_tokens
      WHERE expires_at >= NOW()
      GROUP BY type
    `);

    if (statsResult.length > 0) {
      log('\nCurrent token statistics:', 'blue');
      statsResult.forEach(stat => {
        log(`  ${stat.type}: ${stat.count} total (${stat.used_count} used, ${stat.unused_count} unused)`, 'blue');
      });
    }

    return {
      deleted: deletedCount,
      message: 'Cleanup successful',
      stats: statsResult
    };

  } catch (error) {
    log(`❌ Error during cleanup: ${error.message}`, 'red');
    throw error;
  } finally {
    await sequelize.close();
    log('Database connection closed', 'cyan');
  }
}

async function cleanupOldUsedTokens(daysOld = 30) {
  try {
    log(`\nCleaning up used tokens older than ${daysOld} days...`, 'cyan');

    await sequelize.authenticate();

    // Get count before cleanup
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM user_tokens 
      WHERE used_at IS NOT NULL 
      AND used_at < DATE_SUB(NOW(), INTERVAL ${daysOld} DAY)
    `);
    const oldUsedCount = countResult[0].count;

    if (oldUsedCount === 0) {
      log('No old used tokens found', 'yellow');
      return { deleted: 0, message: 'No old used tokens' };
    }

    log(`Found ${oldUsedCount} old used tokens`, 'yellow');

    // Delete old used tokens
    const [result] = await sequelize.query(`
      DELETE FROM user_tokens 
      WHERE used_at IS NOT NULL 
      AND used_at < DATE_SUB(NOW(), INTERVAL ${daysOld} DAY)
    `);

    const deletedCount = result.affectedRows || 0;
    log(`✅ Deleted ${deletedCount} old used tokens`, 'green');

    return {
      deleted: deletedCount,
      message: 'Old tokens cleanup successful'
    };

  } catch (error) {
    log(`❌ Error during old tokens cleanup: ${error.message}`, 'red');
    throw error;
  }
}

async function getTokenStatistics() {
  try {
    log('\nGenerating token statistics...', 'cyan');

    await sequelize.authenticate();

    // Overall statistics
    const [overallStats] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_tokens,
        SUM(CASE WHEN expires_at < NOW() THEN 1 ELSE 0 END) as expired_tokens,
        SUM(CASE WHEN expires_at >= NOW() THEN 1 ELSE 0 END) as active_tokens,
        SUM(CASE WHEN used_at IS NOT NULL THEN 1 ELSE 0 END) as used_tokens,
        SUM(CASE WHEN used_at IS NULL AND expires_at >= NOW() THEN 1 ELSE 0 END) as unused_active_tokens
      FROM user_tokens
    `);

    log('\n📊 Overall Statistics:', 'blue');
    const stats = overallStats[0];
    log(`  Total Tokens: ${stats.total_tokens}`, 'blue');
    log(`  Active Tokens: ${stats.active_tokens}`, 'green');
    log(`  Expired Tokens: ${stats.expired_tokens}`, 'yellow');
    log(`  Used Tokens: ${stats.used_tokens}`, 'blue');
    log(`  Unused Active Tokens: ${stats.unused_active_tokens}`, 'cyan');

    // By type statistics
    const [typeStats] = await sequelize.query(`
      SELECT 
        type,
        COUNT(*) as count,
        SUM(CASE WHEN expires_at < NOW() THEN 1 ELSE 0 END) as expired,
        SUM(CASE WHEN used_at IS NOT NULL THEN 1 ELSE 0 END) as used
      FROM user_tokens
      GROUP BY type
    `);

    if (typeStats.length > 0) {
      log('\n📊 By Type:', 'blue');
      typeStats.forEach(stat => {
        log(`  ${stat.type}:`, 'blue');
        log(`    Total: ${stat.count}`, 'blue');
        log(`    Expired: ${stat.expired}`, 'yellow');
        log(`    Used: ${stat.used}`, 'green');
      });
    }

    // Recent activity (last 24 hours)
    const [recentStats] = await sequelize.query(`
      SELECT 
        COUNT(*) as created_24h,
        SUM(CASE WHEN used_at IS NOT NULL THEN 1 ELSE 0 END) as used_24h
      FROM user_tokens
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    `);

    log('\n📊 Last 24 Hours:', 'blue');
    log(`  Created: ${recentStats[0].created_24h}`, 'blue');
    log(`  Used: ${recentStats[0].used_24h}`, 'green');

    return {
      overall: overallStats[0],
      byType: typeStats,
      recent: recentStats[0]
    };

  } catch (error) {
    log(`❌ Error generating statistics: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'cleanup';

  log('🧹 OTP Token Cleanup Script', 'cyan');
  log('=' .repeat(60), 'cyan');

  try {
    switch (command) {
      case 'cleanup':
        await cleanupExpiredTokens();
        break;

      case 'cleanup-old':
        const days = parseInt(args[1]) || 30;
        await cleanupExpiredTokens();
        await cleanupOldUsedTokens(days);
        break;

      case 'stats':
        await getTokenStatistics();
        break;

      case 'full':
        await cleanupExpiredTokens();
        await cleanupOldUsedTokens(30);
        await getTokenStatistics();
        break;

      default:
        log('Unknown command. Available commands:', 'yellow');
        log('  cleanup       - Remove expired tokens', 'yellow');
        log('  cleanup-old   - Remove expired + old used tokens', 'yellow');
        log('  stats         - Show token statistics', 'yellow');
        log('  full          - Run all cleanup + show stats', 'yellow');
        process.exit(1);
    }

    log('\n✅ Script completed successfully', 'green');
    process.exit(0);

  } catch (error) {
    log(`\n❌ Script failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  cleanupExpiredTokens,
  cleanupOldUsedTokens,
  getTokenStatistics
};
