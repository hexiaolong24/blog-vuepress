// 标志是mount阶段还是更新阶段
let isMount = true

// 当前我们正在处理哪一个hooks
// 比如调用两次useState 初始化了两个state
let workInProgressHook = null

// 每个组价对应的fiber节点
const fiber = {
  // 保存的是组件本身
  stateNode: App,
  // 保存hooks对应的数据
  memoizedState: null,
}

function useState(initialState) {
  let hook
  // 获取到当前hook代表的是哪一个hook
  if(isMount) {
    // 取到当前阶段对应的数据
    // 首次渲染时需要创建一个hook
    hook = {
      // hook 初始化的值
      memoizedState: initialState,
      // hook是一条单项链表 指针指向下一个hook null
      next: null,
      // 是一个队列 代表的是每一个useState 返回的setNum,可能会连续调用多次setNum
      queue: {
        // 保存的是最后一个update
        padding: null 
      }
    }
    if(!fiber.memoizedState) {
      // 没有值代表的是第一次调用useState
      fiber.memoizedState = hook
    }else {
      // 有值就是非第一次调用
      // useState(0)
      // useState(1)
      // 需要将hook指向hook链表的下一个节点
      workInProgressHook.next = hook
    }
    // 赋值当前hook
    workInProgressHook = hook
  }else {
    // update时已经有一条链表
    // 这个方法时要往出去当前的hook， workInProgressHook 代表的就是当前的hook
    hook = workInProgressHook
    // 获取到当前的hook之后  将当前的hook指向下一个节点
    workInProgressHook = workInProgressHook.next
  }

  // 基础的state
  let baseState = hook.memoizedState
  if(hook.queue.padding) {
    // 存在需要执行的update 
    let firstUpdate = hook.queue.padding.next
    // 遍历链表计算新的state
    do {
      const action = firstUpdate.action
      baseState = action(baseState)
      firstUpdate = firstUpdate.next
    } while (firstUpdate !== hook.queue.padding.next)
    hook.queue.padding = null
  }

  hook.memoizedState = baseState

  return [baseState, dispatchAction.bind(null, hook.queue)]
}

/**
 * 
 * @param {*} queue 是一个队列，代表的是多个setNum
 * @param {*} action 传入的操作数据的函数 例如 setNum(num = num + 1)  num = num + 1就是一个action
 */
function dispatchAction(queue, action) {
  // 是一个环状链表 可以方便操作优先级
  const update = {
    action,
    next: null
  }
  // update 是环状链表
  if(queue.padding === null) {
    // U0 - U0
    update.next = update
  }else {
    // U1 - U0 - U1
    // queue.padding 是最后一个update
    // queue.padding.next 就是第一个update
    update.next = queue.padding.next
    queue.padding.next = update
  }
  // 将新创建的指向最后一个
  queue.padding = update
  // 触发更新
  schedule()
}

// 调度
function schedule() {
  // 每次调用schedule的时候需要先将当前节点的数据赋值给代表当前的额hook
  workInProgressHook = fiber.memoizedState
  // 调度组件本身
  const app = fiber.stateNode()
  // 首次调用完之后更新
  isMount = false
  return app
}

function App() {
  const [num, setNum] = useState(0)
  const [num1, setNum1] = useState(10)
  console.log('isMount', isMount)
  console.log('num', num)
  console.log('num1', num1)
  return {
    onClick() {
      setNum(num => num + 1)
    },
    onFocus() {
      setNum1(num => num + 10)
    }
  }
}

const app = schedule()

app.onClick()
app.onClick()
app.onFocus()
app.onFocus()
app.onFocus()