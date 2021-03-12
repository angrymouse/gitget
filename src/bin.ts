#!/usr/bin/env node

import { error, parseGithubUrl } from './utils'
import { gitget } from './gitget'

const KEYS = process.argv.slice(2)
if (KEYS.length === 0 || KEYS.length > 2) error()

KEYS[0] = parseGithubUrl(KEYS[0])

const USER = KEYS[0].split('/')[0]
const REPO = KEYS[0].split('/')[1]
if (!REPO) error()

const SUBDIR = KEYS[0]
  .replace(/\/$/, '')
  .split('/')
  .filter((v, i) => i >= 2)
  .join('/')

const FOLDER = KEYS[1]
const BRANCH = SUBDIR ? SUBDIR.split('#')[1] : REPO.split('#')[1]

gitget({ folder: FOLDER, user: USER, subdir: SUBDIR, branch: BRANCH, repo: REPO })
