const path = require("path");

/**
 * 我们的代理设置
 */
function myProxy() {
  if (process.env.TARO_ENV === 'production') {
    // build的时候，不需要配置代理
    return null
  }

  // 以下url要转发到后端
  const urls = [
    '/prod-api',
  ]

  // 迭代urls，生成代理规则
  const proxy = {}
  for (let i = 0; i < urls.length; i++) {
    const key = urls[i]
    proxy[key] = {
      target: 'http://10.137.42.15:983/prod-api',
      ws: true,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        ['^prod-api']: ''
      }
    }
  }
  console.log('当前用的API代理', proxy)
  return proxy
}

const config = {
  projectName: 'taro-tmp',
  date: '2021-8-27',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    devServer: {
      proxy: myProxy(), // 转发
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
