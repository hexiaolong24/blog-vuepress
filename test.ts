type MyOmit<T, U extends keyof T> = {
  [P in keyof T as P extends U ? never : P]: T[P]
}

type A = {
  name: string
  age: number
}

type B = Omit<A, 'name'>
type C = MyOmit<A, 'name'>