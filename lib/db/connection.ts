import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthcare_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Database query helper
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Database query helper for single row
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  try {
    const [rows] = await pool.execute(sql, params);
    const result = rows as T[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Simple ORM-like interface
export const db = {
  // User operations
  user: {
    async findUnique(where: { id?: string; email?: string; isActive?: boolean }) {
      let sql = 'SELECT * FROM users WHERE 1=1';
      const params: any[] = [];

      if (where.id) {
        sql += ' AND id = ?';
        params.push(where.id);
      }
      if (where.email) {
        sql += ' AND email = ?';
        params.push(where.email);
      }
      if (where.isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(where.isActive);
      }

      return queryOne(sql, params);
    },

    async findMany(where: { clinicId?: string; role?: string; isActive?: boolean } = {}) {
      let sql = 'SELECT * FROM users WHERE 1=1';
      const params: any[] = [];

      if (where.clinicId) {
        sql += ' AND clinic_id = ?';
        params.push(where.clinicId);
      }
      if (where.role) {
        sql += ' AND role = ?';
        params.push(where.role);
      }
      if (where.isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(where.isActive);
      }

      return query(sql, params);
    },

    async create(data: {
      email: string;
      passwordHash: string;
      firstName: string;
      lastName: string;
      role: string;
      clinicId: string;
      phone?: string;
      licenseNumber?: string;
      specialization?: string;
    }) {
      const sql = `
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, role, clinic_id, 
          phone, license_number, specialization
        ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        data.email,
        data.passwordHash,
        data.firstName,
        data.lastName,
        data.role,
        data.clinicId,
        data.phone || null,
        data.licenseNumber || null,
        data.specialization || null,
      ];

      await query(sql, params);
      
      // Return the created user
      return this.findUnique({ email: data.email });
    },

    async update(where: { id: string }, data: Partial<{
      firstName: string;
      lastName: string;
      phone: string;
      lastLogin: Date;
      isActive: boolean;
    }>) {
      const updateFields: string[] = [];
      const params: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          const dbField = key === 'firstName' ? 'first_name' : 
                         key === 'lastName' ? 'last_name' :
                         key === 'lastLogin' ? 'last_login' :
                         key === 'isActive' ? 'is_active' : key;
          updateFields.push(`${dbField} = ?`);
          params.push(value);
        }
      });

      if (updateFields.length === 0) return null;

      params.push(where.id);
      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      
      await query(sql, params);
      return this.findUnique({ id: where.id });
    },
  },

  // Clinic operations
  clinic: {
    async findUnique(where: { id?: string; isActive?: boolean }) {
      let sql = 'SELECT * FROM clinics WHERE 1=1';
      const params: any[] = [];

      if (where.id) {
        sql += ' AND id = ?';
        params.push(where.id);
      }
      if (where.isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(where.isActive);
      }

      return queryOne(sql, params);
    },

    async findMany() {
      return query('SELECT * FROM clinics WHERE is_active = 1');
    },
  },

  // Refresh token operations
  refreshToken: {
    async create(data: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    }) {
      const sql = `
        INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
        VALUES (UUID(), ?, ?, ?)
      `;
      
      return query(sql, [data.userId, data.tokenHash, data.expiresAt]);
    },

    async findFirst(where: {
      userId?: string;
      tokenHash?: string;
      expiresAt?: { gt: Date };
    }, include?: { user?: { include?: { clinic?: boolean } } }) {
      let sql = 'SELECT rt.*';
      const joins: string[] = [];
      const params: any[] = [];
      let conditions: string[] = [];

      if (include?.user) {
        sql += ', u.*';
        joins.push('LEFT JOIN users u ON rt.user_id = u.id');
        
        if (include.user.include?.clinic) {
          sql += ', c.*';
          joins.push('LEFT JOIN clinics c ON u.clinic_id = c.id');
        }
      }

      sql += ' FROM refresh_tokens rt ' + joins.join(' ') + ' WHERE 1=1';

      if (where.userId) {
        conditions.push('rt.user_id = ?');
        params.push(where.userId);
      }
      if (where.tokenHash) {
        conditions.push('rt.token_hash = ?');
        params.push(where.tokenHash);
      }
      if (where.expiresAt?.gt) {
        conditions.push('rt.expires_at > ?');
        params.push(where.expiresAt.gt);
      }

      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
      }

      const result = await queryOne(sql, params);
      
      // Transform result to match expected structure
      if (result && include?.user) {
        return {
          ...result,
          user: {
            id: result.user_id,
            clinicId: result.clinic_id,
            email: result.email,
            firstName: result.first_name,
            lastName: result.last_name,
            role: result.role,
            isActive: result.is_active,
            ...(include.user.include?.clinic && {
              clinic: {
                id: result.clinic_id,
                name: result.name,
                isActive: result.is_active,
              }
            })
          }
        };
      }

      return result;
    },

    async deleteMany(where: { userId?: string; tokenHash?: string }) {
      let sql = 'DELETE FROM refresh_tokens WHERE 1=1';
      const params: any[] = [];

      if (where.userId) {
        sql += ' AND user_id = ?';
        params.push(where.userId);
      }
      if (where.tokenHash) {
        sql += ' AND token_hash = ?';
        params.push(where.tokenHash);
      }

      return query(sql, params);
    },
  },

  // User session operations
  userSession: {
    async create(data: {
      userId: string;
      ipAddress?: string;
      userAgent?: string;
    }) {
      const sql = `
        INSERT INTO user_sessions (id, user_id, ip_address, user_agent)
        VALUES (UUID(), ?, ?, ?)
      `;
      
      return query(sql, [
        data.userId,
        data.ipAddress || null,
        data.userAgent || null,
      ]);
    },

    async update(where: { userId: string }, data: { logoutAt: Date }) {
      const sql = 'UPDATE user_sessions SET logout_at = ? WHERE user_id = ? AND logout_at IS NULL';
      return query(sql, [data.logoutAt, where.userId]);
    },
  },
};

export default pool;