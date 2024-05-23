import fs from 'fs'
import { rm } from 'fs/promises'
import path from 'path'
import { execa } from 'execa'
import minimist from 'minimist'

const allTargets = fs.readdirSync('packages').filter(f => {
  // 过滤掉非目录文件
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }

  const pkgPath = path.resolve(`packages/${f}/package.json`)
  const pkgData = fs.readFileSync(pkgPath, 'utf-8')
  const pkg = JSON.parse(pkgData)
  // 过滤掉私有包和不带编译配置的包
  return !pkg.private
})

const build = async function (target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkgDirPath = path.resolve(pkgDir, 'package.json')
  const pkgData = await fs.promises.readFile(pkgDirPath, 'utf-8')
  const pkg = JSON.parse(pkgData)

  // 编译前移除之前生成的产物
  await rm(`${pkgDir}/dist`, { recursive: true, force: true })

  // 使用各自vite配置文件进行编译打包
  await execa('pnpm', ['build'], { cwd: pkgDir, stdio: 'inherit' })
}

const args = minimist(process.argv.slice(2))
const targets = args._.length ? args._ : allTargets

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
