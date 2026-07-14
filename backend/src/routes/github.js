const express = require('express');

const router = express.Router();

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'jeffdev';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// Simple in-memory cache (15 min TTL)
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 15 * 60 * 1000;

// GET /api/github — returns pinned repos + stats
router.get('/', async (req, res, next) => {
  try {
    const now = Date.now();
    if (cache.data && now - cache.timestamp < CACHE_TTL) {
      return res.json({ success: true, data: cache.data, cached: true });
    }

    const headers = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'portfolio-app',
    };
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    // Fetch user profile
    const userResp = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
    if (!userResp.ok) {
      throw new Error(`GitHub API error: ${userResp.status}`);
    }
    const user = await userResp.json();

    // Fetch repos
    const reposResp = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=owner`,
      { headers }
    );
    const repos = reposResp.ok ? await reposResp.json() : [];

    const data = {
      username: user.login,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatar_url,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      repos: Array.isArray(repos)
        ? repos.map((r) => ({
            name: r.name,
            description: r.description,
            html_url: r.html_url,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            language: r.language,
            updated_at: r.updated_at,
          }))
        : [],
    };

    cache = { data, timestamp: now };
    res.json({ success: true, data, cached: false });
  } catch (err) {
    // Return fallback if GitHub is unreachable
    res.json({
      success: true,
      data: {
        username: GITHUB_USERNAME,
        public_repos: null,
        repos: [],
        error: 'GitHub API unavailable',
      },
      cached: false,
    });
  }
});

module.exports = router;
