import { effectScope, type EffectScope } from 'vue'

const isSingletonKey = Symbol('isSingleton')

interface Constructor<T> {
  new (...args: unknown[]): T
  [isSingletonKey]?: boolean
}

type InjectionKey<T> = symbol | { __type__: T }

export type Token<T> = InjectionKey<T> | Constructor<T>

class Container {
  private readonly instances = new Map<
    Token<unknown>,
    { instance: unknown; effectScope: EffectScope }
  >()

  public resolve<T>(token: Token<T>): T {
    if (this.instances.has(token)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- 在运行时可以确保类型正确
      const { instance } = this.instances.get(token)!
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- 在运行时可以确保类型正确
      return instance as T
    }

    if (typeof token === 'function') {
      const ef = effectScope(true)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- 必定不为 undefined
      const instance = ef.run(() => new token())!

      if (token[isSingletonKey]) {
        this.instances.set(token, { instance, effectScope: ef })
      }

      return instance
    }

    throw new Error('invalid token')
  }

  public deleteInstance<T>(token: Constructor<T>) {
    const value = this.instances.get(token)

    if (value) {
      value.effectScope.stop()
    }

    return this.instances.delete(token)
  }
}

export const container = new Container()

export const singleton = function () {
  return function (klass: Constructor<unknown>) {
    klass[isSingletonKey] = true
  }
}
