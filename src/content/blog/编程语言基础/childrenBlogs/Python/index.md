---
title: Python
description: Python 学习笔记：基础语法（变量、数据类型、运算符、控制流、函数、容器、模块、异常、文件、类与对象）与进阶语法（推导式、迭代器与生成器、装饰器、上下文管理器、魔术方法、类型注解、并发、性能与最佳实践）。
pubDate: 2026-10-1
updatedDate: 2026-10-2
tags:
  - 编程语言
---
Python 是一种解释型、动态类型、面向对象的通用高级编程语言，由 Guido van Rossum 于 1991 年发布。它以**简洁易读、生态丰富**著称，广泛用于数据分析、人工智能、Web 后端、自动化运维与科学计算。Python 奉行「可读性至上」，用缩进表达代码块，标准库覆盖面极广，被誉为「自带电池」（batteries included）。

本文按「基础语法 → 进阶语法」组织，既可作为入门提纲，也可作为日常速查。

## Python 基础语法

### 第一个程序

```python
# hello.py
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
```

```bash
python hello.py
```

- Python 用**缩进**（推荐 4 个空格）表示代码块，而不是花括号；混用 Tab 与空格会报错。
- 语句通常一行一条，一般不需要分号。
- 文件以 `.py` 结尾；交互式解释器可直接运行表达式。

### 变量与动态类型

```python
x = 10            # 整数
x = "hello"       # 同一名字可指向不同类型（动态类型）
name: str = "Tom" # 类型注解，运行时不做强制检查
```

Python 是**强类型 + 动态类型**：变量无需声明类型，但不同类型间的非法运算会报错（如 `"1" + 1`）。变量本质是「名字到对象的引用」。

### 数据类型

| 类型 | 示例 | 可变性 |
|---|---|---|
| `int` | `42` | 不可变 |
| `float` | `3.14` | 不可变 |
| `complex` | `1 + 2j` | 不可变 |
| `bool` | `True` / `False` | 不可变 |
| `str` | `"abc"` | 不可变 |
| `list` | `[1, 2, 3]` | 可变 |
| `tuple` | `(1, 2, 3)` | 不可变 |
| `set` | `{1, 2, 3}` | 可变 |
| `dict` | `{"a": 1}` | 可变 |
| `NoneType` | `None` | 不可变 |

可变对象（`list`/`dict`/`set`）可原地修改；不可变对象（`int`/`str`/`tuple` 等）一旦创建就不能改变。函数传参传递的是对象引用，修改可变实参会反映到外部。

### 字符串

```python
s = "hello"
print(s.upper(), s[0], s[-1], s[1:4])   # HELLO h o ell
print(len(s))

name, age = "Tom", 18
print(f"{name} is {age}")               # f-string 格式化

print("a,b,c".split(","))               # ['a', 'b', 'c']
print("-".join(["a", "b"]))             # a-b
print("  hi  ".strip())
```

- 切片 `s[start:stop:step]`，越界会被截断，但索引越界抛 `IndexError`。
- 字符串是不可变的，所有「修改」都会返回新字符串。
- 常用格式化：f-string（推荐）、`str.format()`、`%`。

### 运算符

| 分类 | 运算符 |
|---|---|
| 算术 | `+` `-` `*` `/` `//` `%` `**` |
| 比较 | `==` `!=` `<` `<=` `>` `>=` |
| 逻辑 | `and` `or` `not` |
| 位运算 | `&` `^` `~` `<<` `>>`（按位或写作 `\|`） |
| 身份 | `is` / `is not` |
| 成员 | `in` / `not in` |

要点：

- `/` 是真除法（结果为 `float`），`//` 是向下取整除法，`%` 取模。
- `==` 比较值，`is` 比较是否为**同一个对象**；不要用 `is` 比较整数或字符串。
- `and`/`or` 短路并**返回操作数本身**，可用于默认值：`name = user_input or "default"`。
- 链式比较：`0 <= x < 100`。

### 控制流

```python
if score >= 90:
    grade = "A"
elif score >= 60:
    grade = "P"
else:
    grade = "F"

for i in range(5):          # 0..4
    print(i)
else:                       # 循环未被 break 打断时执行
    print("done")

while n > 0:
    n -= 1
```

Python 3.10+ 引入结构化模式匹配 `match`：

```python
match command:
    case "quit":
        quit()
    case ["go", direction]:
        move(direction)
    case _:
        print("unknown")
```

`for` 是可迭代对象循环；`range(start, stop, step)` 生成整数序列。`break` 跳出循环，`continue` 进入下一轮。

### 容器

```python
fruits = ["apple", "banana"]     # list
fruits.append("cherry")          # 末尾追加
fruits[0] = "pear"
fruits.insert(1, "kiwi")
fruits.remove("banana")
print(fruits[-1])                # 支持负索引

point = (1, 2)                   # tuple，不可变
x, y = point                     # 解包

s = {1, 2, 3}                    # set
s.add(4)
print(2 in s)

d = {"name": "Tom", "age": 18}   # dict
d["city"] = "Beijing"
print(d.get("missing", "default"))
for k, v in d.items():
    print(k, v)
```

常用内置函数：`len()`、`sorted()`、`sum()`、`min()`、`max()`、`enumerate()`、`zip()`。字典键必须是**可哈希**（通常是不可变）类型。

### 函数

```python
def greet(name, greeting="Hi", *args, **kwargs):
    print(greeting, name, args, kwargs)
    return len(name)

greet("Tom")
greet("Tom", greeting="Hello")
greet("Tom", "Hello", 1, 2, key="value")
```

- 参数顺序：位置参数 → 默认参数 → `*args` → 关键字参数 → `**kwargs`。
- **不要用可变对象作默认值**：`def f(x=[])` 会在多次调用间共享同一个列表，应写 `x=None` 再判断。
- 函数可返回多个值（实际是元组）。
- `lambda` 定义匿名函数：`square = lambda x: x * x`。

作用域遵循 **LEGB**：Local → Enclosing → Global → Built-in。

### 模块与包

```python
import math
from math import sqrt
import numpy as np

print(math.pi, sqrt(2))
```

```python
# 同一文件既能被导入，也能直接运行
if __name__ == "__main__":
    main()
```

包是包含 `__init__.py` 的目录（Python 3.3+ 的命名空间包可省略）。用 `venv` 隔离依赖：

```bash
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install requests
pip freeze > requirements.txt
```

### 异常处理

```python
try:
    risky()
except ValueError as e:
    print("值错误:", e)
except (TypeError, KeyError):
    print("类型或键错误")
except Exception as e:
    print("其他:", e)
else:
    print("没有异常时执行")
finally:
    print("总会执行")

raise ValueError("非法参数")
```

- 自定义异常通常继承 `Exception`。
- 避免裸 `except:`，它会连 `KeyboardInterrupt`、`SystemExit` 一起吞掉。
- `else` 在无异常时执行；`finally` 无论如何都执行，常用于释放资源。

### 文件 I/O

```python
with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())

with open("out.txt", "w", encoding="utf-8") as f:
    f.write("hello\n")
```

`with` 会在退出时自动关闭文件。模式：`r` 读、`w` 覆盖写、`a` 追加、`b` 二进制、`+` 读写。结构化数据用 `json.load/dump`、`csv` 模块。

### 类与对象

```python
class Animal:
    species = "unknown"          # 类属性，所有实例共享

    def __init__(self, name):    # 构造方法
        self.name = name         # 实例属性

    def speak(self):
        return "..."

class Dog(Animal):               # 继承
    def speak(self):             # 方法重写
        return "Woof"

d = Dog("Rex")
print(d.name, d.speak(), isinstance(d, Animal))
```

- 每个实例方法第一个参数是 `self`（约定名）。
- `__init__` 负责初始化，`__new__` 负责创建实例。
- 支持多继承，方法解析顺序由 **MRO**（C3 线性化）决定。
- 没有 `private`，约定以单下划线 `_x` 表示内部使用，双下划线 `__x` 触发名称改写。

## Python 进阶语法

### 推导式

```python
squares = [x * x for x in range(10) if x % 2 == 0]     # 列表推导
matrix  = [[i * j for j in range(3)] for i in range(3)] # 嵌套
mapping = {k: v for k, v in items}                      # 字典推导
unique  = {x for x in data}                             # 集合推导
gen     = (x * x for x in range(10))                    # 生成器表达式，惰性
```

推导式比显式循环更简洁、通常也更快，但嵌套过深会牺牲可读性。

### 迭代器与生成器

```python
def countdown(n):
    while n > 0:
        yield n        # 生成器：产出后暂停，下次从这里继续
        n -= 1

for i in countdown(3):
    print(i)

it = iter([1, 2, 3])
print(next(it))        # 1
```

- 实现了 `__iter__` / `__next__` 的对象即迭代器，可用 `for` 或 `next()` 消费。
- 生成器用 `yield` 惰性产出，适合处理大文件、大数据流，**节省内存**。
- 生成器只能遍历一次；需要多次遍历请转成列表或返回新生成器。

### 装饰器

装饰器是「接受函数、返回新函数」的可调用对象，用于在不修改原函数的前提下增强功能。

```python
import functools
import time

def timer(func):
    @functools.wraps(func)          # 保留原函数的 __name__、__doc__ 等
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(func.__name__, time.perf_counter() - start)
        return result
    return wrapper

@timer
def work():
    ...
```

带参数的装饰器需要再包一层：

```python
def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def hi():
    print("hi")
```

常用内置装饰器：`@staticmethod`、`@classmethod`、`@property`。

### 上下文管理器

```python
class MyResource:
    def __enter__(self):
        print("acquire")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("release")
        return False      # 返回 True 会吞掉异常

with MyResource() as r:
    ...
```

用 `contextlib` 更简洁：

```python
from contextlib import contextmanager

@contextmanager
def resource():
    print("acquire")
    try:
        yield "value"
    finally:
        print("release")

with resource() as v:
    print(v)
```

### 魔术方法（数据模型）

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):            # 开发者可读表示（调试）
        return f"Vector({self.x}, {self.y})"

    def __str__(self):             # 用户可读表示
        return f"({self.x}, {self.y})"

    def __add__(self, other):      # 支持 +
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):       # 支持 ==
        return (self.x, self.y) == (other.x, other.y)

    def __len__(self):
        return 2

    def __getitem__(self, i):      # 支持索引与切片
        return (self.x, self.y)[i]

    def __call__(self):            # 让实例可像函数一样调用
        return self.x + self.y
```

理解魔术方法就理解了 Python 的对象模型：`len()` 调用 `__len__`，`x[i]` 调用 `__getitem__`，`with` 调用 `__enter__`/`__exit__`。

### 类型注解

```python
from typing import Optional, Sequence

def find(items: Sequence[int], target: int) -> Optional[int]:
    for i, v in enumerate(items):
        if v == target:
            return i
    return None

# Python 3.10+ 可直接用 | 表示联合类型
def parse(text: str) -> int | None:
    ...
```

`dataclass` 自动生成 `__init__`、`__repr__`、`__eq__`：

```python
from dataclasses import dataclass, field

@dataclass
class Point:
    x: int
    y: int = 0
    tags: list[str] = field(default_factory=list)   # 可变默认值用工厂函数
```

注解不影响运行时行为，需配合静态检查工具 `mypy` / `pyright` 发挥价值。

### 函数式工具

```python
from functools import reduce, partial, lru_cache
import itertools

nums = [1, 2, 3, 4]
print(list(map(lambda x: x * 2, nums)))          # [2, 4, 6, 8]
print(list(filter(lambda x: x % 2 == 0, nums)))  # [2, 4]
print(reduce(lambda a, b: a + b, nums))          # 10

add10 = partial(lambda a, b: a + b, 10)

@lru_cache(maxsize=None)     # 记忆化，避免重复计算
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(list(itertools.combinations([1, 2, 3], 2)))
```

### 闭包与 nonlocal

```python
def counter():
    n = 0
    def inc():
        nonlocal n         # 声明修改外层函数的变量
        n += 1
        return n
    return inc

c = counter()
print(c(), c())            # 1 2
```

闭包捕获的是变量本身而非当时的值，循环中创建闭包要特别注意延迟绑定问题。

### 可变对象与拷贝

```python
import copy

a = [[1, 2], [3, 4]]
b = a                  # 同一对象，改 b 会影响 a
c = a.copy()           # 浅拷贝：内层列表仍共享
d = copy.deepcopy(a)   # 深拷贝：完全独立
```

### 并发

- **threading**：线程，适合 I/O 密集型；受 **GIL** 限制，CPU 密集型无法真正并行。
- **multiprocessing**：多进程，绕过 GIL，适合 CPU 密集型。
- **asyncio**：单线程事件循环，用 `async` / `await` 处理高并发 I/O。

```python
import asyncio

async def fetch(name):
    await asyncio.sleep(1)
    return name

async def main():
    results = await asyncio.gather(fetch("a"), fetch("b"))
    print(results)

asyncio.run(main())
```

### 动态属性与 `__slots__`

```python
class User:
    __slots__ = ("name", "age")   # 限定属性，节省内存、加快访问

u = User()
u.name = "Tom"
# u.email = "x"   # AttributeError

class Proxy:
    def __getattr__(self, item):  # 仅在常规查找失败时调用
        return f"missing: {item}"
```

`__getattr__` / `__setattr__` / `hasattr` 等让对象具备动态行为，框架与 ORM 大量使用。

### 性能与最佳实践

- 遵循 **PEP 8**：`snake_case` 命名、常量全大写、4 空格缩进、行宽约 79/88。
- 依赖管理：`venv` + `requirements.txt` 或 `pyproject.toml`。
- 优先使用内置函数、生成器与切片；先用 `cProfile` / `timeit` 定位瓶颈，再优化。
- 常见生态：NumPy/Pandas（数据）、asyncio/aiohttp（I/O）、Cython/Numba（计算加速）。
- 避免可变默认参数、裸 `except:`、通配符导入 `from x import *`。

### 标准库速查

| 模块 | 用途 |
|---|---|
| `collections` | `Counter` `defaultdict` `deque` `namedtuple` |
| `itertools` | 组合、排列、无限迭代器 |
| `functools` | `lru_cache` `partial` `reduce` |
| `pathlib` | 面向对象的路径操作 |
| `json` / `csv` / `sqlite3` | 数据读写 |
| `re` | 正则表达式 |
| `datetime` | 日期时间 |
| `os` / `sys` / `shutil` | 系统与文件操作 |
| `logging` | 日志 |
| `argparse` | 命令行参数 |
| `concurrent.futures` | 线程/进程池 |
| `typing` / `dataclasses` | 类型注解与数据类 |

---

## 小结

Python 语法门槛低，但真正的进阶在于理解**对象模型（魔术方法）、迭代协议、可变性与并发模型**。掌握推导式、生成器、装饰器、上下文管理器这「四件套」，几乎就能写出地道的 Pythonic 代码；再配合类型注解与虚拟环境，足以胜任中大型工程。

推荐阅读：《流畅的 Python》《Effective Python》《Python Cookbook》。
