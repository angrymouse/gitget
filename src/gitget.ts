import { PACKAGE_NAME, download, error, getDefaultBranch, makeBold, setSilent, step, success, trim } from './utils'
import { getNpmPackage } from './services/npm'

export interface GitGetOption {
  user?: string
  repo?: string
  folder?: string
  subdir?: string
  /** specify a tag, branch or commit */
  branch?: string
  test?: boolean
  /** silences steps (errors are still displayed) */
  silent?: boolean
  /** npm package name */
  npm?: string
}

export const gitget = async (options: GitGetOption) => {
  const { user, repo, folder, subdir, branch, test, silent, npm } = options

  // set silent
  setSilent(silent)

  // get from npm
  if (npm) {
    const res = await getNpmPackage(npm)
    return res
  }

  if (!user) return error()
  if (!repo) return error()

  // trim input
  const USER = trim(user)
  const REPO = trim(repo.split('#')[0])
  if (!REPO) return error()
  const FOLDER = trim(folder)
  const SUBDIR = trim(subdir?.split('#')[0])
  const BRANCH = branch

  // return test results
  let t = `Clone ${USER}/${REPO}`
  if (SUBDIR) t += `/${SUBDIR}`
  t += `#${BRANCH ? BRANCH : 'default'}`
  t += ` to /${FOLDER ? FOLDER : REPO}.`
  if (test) return { user: USER, repo: REPO, folder: FOLDER, subdir: SUBDIR, branch: BRANCH, isTest: true, str: t }

  // print some infos
  step(`Starting: ${makeBold(PACKAGE_NAME)}`)
  step('User:', USER)
  step('Repo:', REPO)
  if (SUBDIR) step('Subdir:', SUBDIR)

  let defaultBranch = BRANCH

  // get default branch
  if (!BRANCH) {
    defaultBranch = await getDefaultBranch(USER, REPO).catch(err => error(err.message))
    if (!defaultBranch) return error('Default branch not found')
    step('Default Branch:', defaultBranch)
  }

  step('Tag/Branch/Commit:', defaultBranch)

  const downloadLink = `https://github.com/${USER}/${REPO}/archive/${defaultBranch}.tar.gz`
  const CWD = FOLDER ?? REPO
  await download(downloadLink, CWD, SUBDIR)

  // done
  success(`Done! Your repo is in /${makeBold(CWD)}.`)
  return { success: true }
}
