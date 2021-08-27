import $, {CancelTokenSource} from "axios";

interface parallelData {
  url: string,
  data: Object,
  source?: CancelTokenSource | any
}

interface requestData extends parallelData {
  done?: () => void
}

interface parallelMethod extends parallelData {
  method: string
}

interface parallelParams {
  data: Array<parallelMethod>,
  call: (args: [] | Array<any>) => void
}

interface requestMethod extends requestData {
  method: string
}

export default class ApiService {
  constructor() {
    this.init()
  }

  private static createInstance(): any {
    return $.create({
      baseURL: '',
      timeout: 3000,
      headers: {}
    })
  }

  private init() {
    $.interceptors.request.use(config => {
      console.log('error-------------')
      return config
    }, error => {
      console.log('error-------------', error)
      return Promise.reject(error)
    })

    $.interceptors.response.use(response => {
      console.log('error-------------')
      return response
    }, error => {
      console.log('error-------------', error)
      return Promise.reject(error)
    })
  }

  private static createSource() {
    let CancelToken = $.CancelToken;
    return CancelToken.source();
  }

  private static createRequest(par: requestMethod | parallelMethod): any {
    par.source = ApiService.createSource()
    return ApiService.createInstance().request({
      url: par.url,
      method: par.method,
      data: par.data
    })
  }

  private static request(par: requestMethod): any {
    return new Promise((resolve, reject) => {
      ApiService.createRequest(par).then(data => {
        resolve(data)
      }).catch(reason => {
        reject(reason)
      }).finally(() => {
        par.done && par.done()
      })
    })
  }

  get(par: requestData): any {
    let p: requestMethod = <requestMethod>par;
    p.method = 'get'
    return ApiService.request(p)
  }

  post(par: requestData): any {
    let p: requestMethod = <requestMethod>par;
    p.method = 'post'
    return ApiService.request(p)
  }

  parallel(pars: parallelParams): void {
    let requests = pars.data.map(x => {
      return ApiService.createRequest(x)
    })
    $.all(requests).then($.spread(pars.call))
  }
}
