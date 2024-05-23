import fs from 'fs'
import { rm } from 'fs/promises'
import path from 'path'
import { execa } from 'execa'
import chalk from 'chalk'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import minimist from 'minimist'
import { log } from 'console'

// 当前文件所在目录
const __dirname = path.dirname(new URL(import.meta.url).pathname)
// 项目根路径
const projectRoot = path.resolve(__dirname, '../')

const allTargets = fs.readdirSync('packages').filter(async f => {
  // 过滤掉非目录文件
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }

  const pkgPath = path.resolve(`packages/${f}/package.json`)
  const pkgData = await fs.promises.readFile(pkgPath, 'utf-8')
  const pkg = JSON.parse(pkgData)
  // 过滤掉私有包和不带编译配置的包
  if (pkg.private && !pkg.buildOptions) {
    return false
  }
  return true
})

const build = async function (target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkgDirPath = path.resolve(pkgDir, 'package.json')
  const pkgData = await fs.promises.readFile(pkgDirPath, 'utf-8')
  const pkg = JSON.parse(pkgData)

  // 编译前移除之前生成的产物
  await rm(`${pkgDir}/dist`, { recursive: true, force: true })

  // -c 指使用配置文件 默认为rollup.config.js
  // --environment 向配置文件传递环境变量 配置文件通过proccess.env.获取
  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [`TARGET:${target}`, formats ? `FORMATS:${formats}` : ``]
        .filter(Boolean)
        .join(',')
    ],
    { stdio: 'inherit' }
  )
  // 如果有声明文件，则将声明文件拷贝到dist目录下
  if (pkg.types) {
    console.log(
      chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`))
    )
    // 执行API Extractor操作 重新生成声明文件
    const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
    const extractorConfig =
      ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true
    })
    if (extractorResult.succeeded) {
      console.log(`API Extractor completed successfully`)
      process.exitCode = 0
    } else {
      console.error(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`
      )
      process.exitCode = 1
    }

    // 删除ts生成的声明文件
    await rm(`${pkgDir}/dist/packages`, { recursive: true, force: true })
    // 删除项目根目录下的类型文件
    log('TOORPATH:::', projectRoot)
    await rm(`${projectRoot}/dist`, { recursive: true, force: true })
  }
}

const args = minimist(process.argv.slice(2))
const targets = args._.length ? args._ : allTargets
const formats = args.formats || args.f

const maxConcurrency = 4 // 并发编译个数

const buildAll = async function () {
  const ret = []
  const executing = []
  for (const item of targets) {
    // 依次对子包执行build()操作
    const p = Promise.resolve().then(() => build(item))
    ret.push(p)

    if (maxConcurrency <= targets.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}
// 执行编译操作
buildAll()
