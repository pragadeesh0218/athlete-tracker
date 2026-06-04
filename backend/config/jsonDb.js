const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function getFile(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readAll(name) {
  const file = getFile(name);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeAll(name, data) {
  fs.writeFileSync(getFile(name), JSON.stringify(data, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Simple DB interface that mirrors mongoose-like usage
const db = {
  // USERS
  users: {
    findOne: (query) => {
      const all = readAll('users');
      return all.find(u => Object.entries(query).every(([k, v]) => u[k] === v)) || null;
    },
    create: (data) => {
      const all = readAll('users');
      const user = { _id: generateId(), createdAt: new Date().toISOString(), ...data };
      all.push(user);
      writeAll('users', all);
      return user;
    },
  },
  // ATHLETES
  athletes: {
    find: (query = {}, opts = {}) => {
      let all = readAll('athletes');
      // filter
      if (query.name?.$regex) {
        const re = new RegExp(query.name.$regex, query.name.$options || '');
        all = all.filter(a => re.test(a.name));
      }
      if (query.sport) all = all.filter(a => a.sport === query.sport);
      // sort (default: newest first)
      all = all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return all;
    },
    countDocuments: (query = {}) => {
      return db.athletes.find(query).length;
    },
    findPage: (query, { sort, skip, limit }) => {
      let all = db.athletes.find(query);
      return all.slice(skip, skip + limit);
    },
    create: (data) => {
      const all = readAll('athletes');
      const athlete = {
        _id: generateId(),
        createdAt: new Date().toISOString(),
        performanceScore: 0,
        completedWorkouts: 0,
        imageUrl: '',
        status: 'Active',
        ...data
      };
      all.push(athlete);
      writeAll('athletes', all);
      return athlete;
    },
    findByIdAndUpdate: (id, update) => {
      const all = readAll('athletes');
      const idx = all.findIndex(a => a._id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...update };
      writeAll('athletes', all);
      return all[idx];
    },
    findByIdAndDelete: (id) => {
      let all = readAll('athletes');
      const found = all.find(a => a._id === id);
      writeAll('athletes', all.filter(a => a._id !== id));
      return found;
    },
  }
};

module.exports = db;
