# C++ Coroutine

This document records the use of coroutine of CPP

|           |                 |
| --------- | --------------- |
| co_await  | stop            |
| co_yield  | stop and return |
| co_return | Complete        |

Given JS code
```js
function fetchData() {
    return new Promise(
        (resolve, reject) => {
            setTimeout(() => {
                resolve("fetched");
            }, 300);
        }
    )
}

async function action(){
    console.log("Action")
    res =await fetchData()
    console.log(res)
    console.log("End Action")
}


async function main() {
    console.log("start main")
    action()
    console.log("End main")
}
main()
```
Result:

```
start main
Action
End main
fetched
End Action
```

You task is to write a similar c++ code with the use of coroutine.

CPP

```cpp
#include <iostream>
#include <chrono>
#include <thread>
#include <coroutine>
#include <future>

struct Task
{
    struct promise_type
    {
        Task get_return_object() { return {}; }
        std::suspend_never initial_suspend() { return {}; }
        std::suspend_never final_suspend() noexcept { return {}; }
        void return_void() {}
        void unhandled_exception() {}
    };
};


auto fetchData(std::string url) {
    struct awaitable
    {
        std::string val;
        bool await_ready() { return false; }
        void await_suspend(std::coroutine_handle<> h)
        {
            std::thread(
                [h, this] {
                    std::this_thread::sleep_for(std::chrono::milliseconds(300));
                    std::cout << "Fetched" << val << std::endl;
                    h.resume();
                }).detach();
        }
        void await_resume() {}
    };
    return awaitable{url};
}



Task fetch(std::string url) {
    std::cout << "start fetch" << std::endl;
    co_await fetchData("hello.com");
    std::cout << "End fetch" << std::endl;
    co_return;
}

int main() {
    std::cout << "Main Start" << std::endl;
    std::string url = "hello.com";
    fetch(url);
    std::cout << "Main continue" << std::endl;

    std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    std::cout << "Main End" << std::endl;
    return 0;
}
```

```
Main Start
start fetch
Main continue
Fetchedhello.com
End fetch
Main End
```



# Conditional Variable

```cpp
#include <iostream>           // std::cout
#include <thread>             // std::thread
#include <mutex>              // std::mutex, std::unique_lock
#include <condition_variable> // std::condition_variable
#include<bits/stdc++.h>
#include<mutex>
#include<unistd.h> 
 
 
std::mutex mtx;
std::condition_variable cv;
bool ready = false;
 
void print_id (int id) {
    std::cout << "----print_id " << '\n';
    std::unique_lock<std::mutex> lck(mtx);
    std::cout << "----lock " << '\n';
    while (!ready) {
        std::cout << "----wait " << '\n';
        cv.wait(lck);
    }
    // ...
    std::cout << "----thread " << id << '\n';
}
 
void go() {
    //修改ready标记，并通知打印线程工作
    std::cout << "go " << '\n';
    std::unique_lock<std::mutex> lck(mtx);

    std::cout << "notify "<< '\n';
    ready = true; 
    std::cout << "sleep "<< '\n';
    cv.notify_one();
    sleep(2);

    lck.unlock();
}
 
int main (){
    std::thread threads[1];
    // 创建10个线程，每个线程当ready标记为真时打印自己的id号
    for (int i=0; i<1; ++i)
        threads[i] = std::thread(print_id,i);
 
    std::cout << "10 threads ready to race...\n";
    go();                       // go!
 
    for (auto& th : threads) th.join();
 
    return 0;
}
```

```
10 threads ready to race...
go 
notify 
sleep 
<---- 2 Second --->
----print_id 
----lock 
----thread 0
```

The follow order of commands will cause the thread never wake up
```cpp

void go() {
    //修改ready标记，并通知打印线程工作
    std::cout << "go " << '\n';
    std::unique_lock<std::mutex> lck(mtx);
    std::cout << "notify "<< '\n';
    cv.notify_one();
    lck.unlock();
    std::cout << "sleep "<< '\n';
    sleep(2);

    ready = true; //!!!!! notice
}

```

```
10 threads ready to race...
go 
notify 
sleep 
----print_id 
----lock 
----wait 
................ keep loading...........
```