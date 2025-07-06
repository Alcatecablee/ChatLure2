import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "../../chatlure.db");

// Initialize SQLite database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database tables if they don't exist
function initDatabase() {
  // Stories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      description TEXT,
      isActive INTEGER DEFAULT 1,
      viralScore INTEGER DEFAULT 50,
      source TEXT DEFAULT 'original',
      tags TEXT DEFAULT '[]',
      stats TEXT DEFAULT '{"views":0,"completions":0,"shares":0,"avgRating":0,"completionRate":0}',
      characters TEXT DEFAULT '[]',
      plotPoints TEXT DEFAULT '[]',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      firstName TEXT,
      lastName TEXT,
      imageUrl TEXT,
      subscription TEXT DEFAULT '{"status":"free"}',
      engagement TEXT DEFAULT '{"storiesRead":0,"avgTime":"0m","favoriteGenre":"unknown"}',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      lastActive TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Credentials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS credentials (
      service TEXT PRIMARY KEY,
      config TEXT NOT NULL,
      enabled INTEGER DEFAULT 0
    )
  `);

  // Analytics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric TEXT NOT NULL,
      value REAL NOT NULL,
      metadata TEXT DEFAULT '{}',
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Initialize default credentials
  const initCredentials = db.prepare(`
    INSERT OR IGNORE INTO credentials (service, config, enabled) VALUES (?, ?, ?)
  `);

  initCredentials.run(
    "reddit",
    JSON.stringify({
      clientId: "",
      clientSecret: "",
      userAgent: "ChatLure:v1.0",
    }),
    0,
  );

  initCredentials.run(
    "clerk",
    JSON.stringify({
      publishableKey: "",
      secretKey: "",
      webhookSecret: "",
    }),
    0,
  );

  initCredentials.run(
    "paypal",
    JSON.stringify({
      clientId: "",
      clientSecret: "",
      planId: "",
      environment: "sandbox",
    }),
    0,
  );
}

// Initialize database on module load
initDatabase();

// Story API
export const StoryAPI = {
  getAll() {
    const stmt = db.prepare("SELECT * FROM stories ORDER BY createdAt DESC");
    return stmt.all().map((row) => ({
      ...row,
      isActive: Boolean(row.isActive),
      tags: JSON.parse(row.tags),
      stats: JSON.parse(row.stats),
      characters: JSON.parse(row.characters),
      plotPoints: JSON.parse(row.plotPoints),
    }));
  },

  getById(id) {
    const stmt = db.prepare("SELECT * FROM stories WHERE id = ?");
    const row = stmt.get(id);
    if (!row) return null;

    return {
      ...row,
      isActive: Boolean(row.isActive),
      tags: JSON.parse(row.tags),
      stats: JSON.parse(row.stats),
      characters: JSON.parse(row.characters),
      plotPoints: JSON.parse(row.plotPoints),
    };
  },

  create(story) {
    const id = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO stories (
        id, title, genre, description, isActive, viralScore, source, 
        tags, stats, characters, plotPoints
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      story.title,
      story.genre,
      story.description || "",
      story.isActive ? 1 : 0,
      story.viralScore || 50,
      story.source || "original",
      JSON.stringify(story.tags || []),
      JSON.stringify(
        story.stats || {
          views: 0,
          completions: 0,
          shares: 0,
          avgRating: 0,
          completionRate: 0,
        },
      ),
      JSON.stringify(story.characters || []),
      JSON.stringify(story.plotPoints || []),
    );

    return this.getById(id);
  },

  update(id, updates) {
    const current = this.getById(id);
    if (!current) return null;

    const stmt = db.prepare(`
      UPDATE stories SET 
        title = ?, genre = ?, description = ?, isActive = ?, 
        viralScore = ?, source = ?, tags = ?, stats = ?, 
        characters = ?, plotPoints = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      updates.title ?? current.title,
      updates.genre ?? current.genre,
      updates.description ?? current.description,
      updates.isActive !== undefined
        ? updates.isActive
          ? 1
          : 0
        : current.isActive
          ? 1
          : 0,
      updates.viralScore ?? current.viralScore,
      updates.source ?? current.source,
      JSON.stringify(updates.tags ?? current.tags),
      JSON.stringify(updates.stats ?? current.stats),
      JSON.stringify(updates.characters ?? current.characters),
      JSON.stringify(updates.plotPoints ?? current.plotPoints),
      id,
    );

    return this.getById(id);
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM stories WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },
};

// User API
export const UserAPI = {
  getAll() {
    const stmt = db.prepare("SELECT * FROM users ORDER BY createdAt DESC");
    return stmt.all().map((row) => ({
      ...row,
      subscription: JSON.parse(row.subscription),
      engagement: JSON.parse(row.engagement),
    }));
  },

  getById(id) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    const row = stmt.get(id);
    if (!row) return null;

    return {
      ...row,
      subscription: JSON.parse(row.subscription),
      engagement: JSON.parse(row.engagement),
    };
  },

  create(user) {
    const stmt = db.prepare(`
      INSERT INTO users (
        id, email, firstName, lastName, imageUrl, subscription, engagement
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      user.id,
      user.email,
      user.firstName || "",
      user.lastName || "",
      user.imageUrl,
      JSON.stringify(user.subscription || { status: "free" }),
      JSON.stringify(
        user.engagement || {
          storiesRead: 0,
          avgTime: "0m",
          favoriteGenre: "unknown",
        },
      ),
    );

    return this.getById(user.id);
  },

  updateActivity(id) {
    const stmt = db.prepare(
      "UPDATE users SET lastActive = CURRENT_TIMESTAMP WHERE id = ?",
    );
    stmt.run(id);
    return this.getById(id);
  },
};

// Credentials API
export const CredentialsAPI = {
  getAll() {
    const stmt = db.prepare("SELECT * FROM credentials");
    const rows = stmt.all();

    const credentials = {
      reddit: { enabled: false },
      clerk: { enabled: false },
      paypal: { enabled: false },
    };

    rows.forEach((row) => {
      credentials[row.service] = {
        ...JSON.parse(row.config),
        enabled: Boolean(row.enabled),
      };
    });

    return credentials;
  },

  updateCredentials(service, config) {
    const stmt = db.prepare(`
      UPDATE credentials SET config = ?, enabled = ? WHERE service = ?
    `);

    stmt.run(JSON.stringify(config), config.enabled ? 1 : 0, service);
  },
};

// Analytics API
export const AnalyticsAPI = {
  track(metric, value, metadata = {}) {
    const stmt = db.prepare(`
      INSERT INTO analytics (metric, value, metadata) VALUES (?, ?, ?)
    `);

    stmt.run(metric, value, JSON.stringify(metadata));
  },

  getDashboardMetrics() {
    // Get basic counts
    const storyCount = db
      .prepare("SELECT COUNT(*) as count FROM stories")
      .get();
    const activeStoryCount = db
      .prepare("SELECT COUNT(*) as count FROM stories WHERE isActive = 1")
      .get();
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();

    // Get recent activity
    const recentStories = db
      .prepare(
        `
      SELECT title, createdAt FROM stories 
      ORDER BY createdAt DESC LIMIT 5
    `,
      )
      .all();

    const recentUsers = db
      .prepare(
        `
      SELECT firstName, lastName, createdAt FROM users 
      ORDER BY createdAt DESC LIMIT 3
    `,
      )
      .all();

    const recentActivity = [
      ...recentStories.map((s) => ({
        type: "story_created",
        message: `New story created: "${s.title}"`,
        timestamp: s.createdAt,
      })),
      ...recentUsers.map((u) => ({
        type: "user_registered",
        message: `New user registered: ${u.firstName} ${u.lastName}`,
        timestamp: u.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    // Get genre distribution
    const genreStats = db
      .prepare(
        `
      SELECT genre, COUNT(*) as count FROM stories 
      GROUP BY genre ORDER BY count DESC
    `,
      )
      .all();

    return {
      totalStories: storyCount.count,
      activeStories: activeStoryCount.count,
      totalUsers: userCount.count,
      averageEngagement: 0.65, // Mock data
      topGenres: genreStats.map((g) => ({
        genre: g.genre,
        count: g.count,
        growth: Math.floor(Math.random() * 20) - 10, // Mock growth
      })),
      recentActivity,
      performanceMetrics: {
        responseTime: 45, // Mock data
        uptime: 99.9,
        errorRate: 0.1,
      },
    };
  },

  getDateRange(startDate, endDate) {
    const stmt = db.prepare(`
      SELECT * FROM analytics 
      WHERE timestamp BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `);

    return stmt.all(startDate, endDate).map((row) => ({
      ...row,
      metadata: JSON.parse(row.metadata),
    }));
  },
};

// Health check function
export function healthCheck() {
  try {
    // Test database connection
    db.prepare("SELECT 1").get();

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
    };
  } catch (error) {
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    };
  }
}
