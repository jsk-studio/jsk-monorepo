
module.exports = {
  boot: {
    json: modifyJson,
    text: modifyText,
    files: ({ monoConfig }) => [
      monoConfig.profile.license === 'MIT' && 'LICENSE',
      '.gitattributes',
      '.gitignore',
      'package.json',
      'tsconfig.json',
      'tslint.json',
      'lerna.json',
      'jest.config.js',
    ],
  },
  package: {
    json: modifyJson,
    text: modifyText,
    files: ({ monoConfig }) => [
      monoConfig.profile.license === 'MIT' && 'LICENSE',
      '.npmignore',
      'package.json',
      'tsconfig.prod.json',
      'src/index.ts',
      'spec/index.spec.ts',
    ],
  },
  mode: {
    'node': {
      packages: 'tsc',
    },
  },
}

function modifyText(path, val, args) {
  if (/\/package.json$/.test(path)) {
    val = pkgReplacer(val, args)
  }
  return val
}

function modifyJson(path, val, args) {
  const { monoConfig } = args
  const isRoot = monoConfig.name === val.name
  const workspaces = Object.keys(monoConfig.workspaces).map(m => m + '/*')
  if (/\/package.json$/.test(path) && isRoot) {
    val.workspaces = workspaces
  } 
  if (/\/lerna.json$/.test(path)) {
    val.packages = workspaces
  }
  return val
}

function pkgReplacer(text, args) {
  const { monoConfig, cmdConfig } = args
  const pkgRepoUrl = monoConfig.profile.repository || ''
  const replaceValues = {
    __PROJECT_NAME__: monoConfig.name,
    __PACKAGE_NAME__: cmdConfig.name || '',
    __PACKAGE_AUTHOR__: monoConfig.profile.author,
    __PACKAGE_REPO_HOME__: pkgRepoUrl && `${pkgRepoUrl}#readme`,
    __PACKAGE_REPO_GIT__: pkgRepoUrl && `git+${pkgRepoUrl}.git`,
    __PACKAGE_REPO_ISSURE__: pkgRepoUrl && `${pkgRepoUrl}/issues`,
  }
  const replaces = Object.assign({}, replaceValues)
  let filetext = text
  for (const key of Object.keys(replaceValues)) {
    filetext = filetext.replace(`\${${key}}`, replaces[key])
  }
  return filetext
}