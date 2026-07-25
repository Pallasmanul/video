import sympy as sp
from sympy import symbols, solve_univariate_inequality, pi

# 定义实数变量 x
x = symbols('x', real=True)

print("========== 高等数学第一章  1-1 习题 ==========\n")



# 1.  求解下列函数的自然定义域


# (1) y = √(3x+2)
res1 = solve_univariate_inequality(3*x + 2 >= 0, x)
print(f"约束：3x+2 ≥ 0，定义域：{res1}\n")

# (2) y = 1/(1-x²)
res2_1 = solve_univariate_inequality(1 - x**2 > 0, x)
res2_2 = solve_univariate_inequality(1 - x**2 < 0, x)
#domain = sp.Union(res2_1, res2_2)
print(f"约束：1-x² ≠ 0，定义域：{res2_2}\n")

# (3) y = 1/x - √(1-x²)
res3 = solve_univariate_inequality(1 - x**2 >= 0 , x)
print(f"根号约束：1-x²≥0 → {res3}，附加x≠0" + " , 定义域：[-1,0) ∪ (0,1]\n")

# (4) y = 1/√(4-x²)
res4 = solve_univariate_inequality(4 - x**2 > 0 , x)
print(f"约束：4-x² > 0，定义域：{res4}\n")

# (5) y = sin√x
res5 = solve_univariate_inequality(x >= 0, x)
print(f"约束：x ≥ 0，定义域：{res5}\n")

# (6) y = tan(x+1)

# (7) y = arcsin(x - 3)
res7_1 = solve_univariate_inequality(x - 3 >= -1, x)
res7_2 = solve_univariate_inequality(x - 3 <= 1, x)
print(f"约束：-1 ≤ x-3 ≤ 1 → {res7_1} 且 {res7_2}，定义域: [2, 4]\n")

# (8) y = √(3-x) + arctan(1/x)
res8 = solve_univariate_inequality(3 - x >= 0, x)
print(f"约束：3-x ≥ 0 → {res8} 且 x≠0，定义域：(-∞,0)∪(0,3]\n")

# (9) y = ln(x+1)
res9 = solve_univariate_inequality(x + 1 > 0, x)
print(f"约束 x+1 > 0, 定义域 {res9}\n")



# 2. 下列各题中， 函数 f(x) 和 g(x) 是否相同？ 为啥

# 判别标准  定义域完全相同 + 对应法则完全相同

# def get_domain(expr, var):
#     """自动求解函数自然定义域"""
#     """
#     手动求解表达式实数自然定义域（兼容所有SymPy版本）
#     处理：对数、分母、偶次根式、三角函数奇点
#     """
#     # 方法：用 solveset 求解使得表达式有定义的x集合
#     try:
#         domain_set = sp.solveset(sp.denominator(expr) != 0, var, sp.Reals)
#     except:
#         domain_set = sp.Reals

#     # 对数约束 log(A) → A>0
#     log_args = expr.atoms(sp.log)
#     for log_func in log_args:
#         arg = log_func.args[0]
#         log_dom = sp.solveset(arg > 0, var, sp.Reals)
#         domain_set = domain_set.intersection(log_dom)

#     # 偶次根式 sqrt(A)、root(A,偶数) → A >= 0
#     root_nodes = expr.atoms(sp.Pow)
#     for p in root_nodes:
#         base, exp = p.as_base_exp()
#         if isinstance(exp, sp.Rational) and exp.q != 1:
#             # 分数指数 1/n
#             n = exp.q
#             if n % 2 == 0:
#                 root_dom = sp.solveset(base >= 0, var, sp.Reals)
#                 domain_set = domain_set.intersection(root_dom)

#     # 三角函数 sec/csc/tan 奇点
#     if expr.has(sp.sec) or expr.has(sp.tan):
#         tan_singular = sp.solveset(sp.cos(var) == 0, var, sp.Reals)
#         trig_dom = sp.Reals - tan_singular
#         domain_set = domain_set.intersection(trig_dom)

#     return domain_set



def get_expr_real_domain(expr, var):
    # 1. 常量直接返回全体实数
    if not isinstance(expr, sp.Basic):
        return sp.Reals

    domain_set = sp.Reals

    # 约束1: 分母不能为0
    numer, denom = expr.as_numer_denom()
    if denom != 1:
        # 求解分母=0的点，从实数集中剔除
        zero_points = sp.solveset(denom == 0, var, sp.Reals)
        domain_set = domain_set - zero_points

    # 约束2: 对数真数>0
    for log_func in expr.atoms(sp.log):
        arg = log_func.args[0]
        log_dom = sp.solveset(arg > 0, var, sp.Reals)
        domain_set = domain_set.intersection(log_dom)

    # 约束3：偶次根式被开方数≥0
    for p in expr.atoms(sp.Pow):
        base, exp = p.as_base_exp()
        if isinstance(exp, sp.Rational) and exp.q != 1:
            n = exp.q
            if n %2 == 0:
                root_dom = sp.solveset(base >= 0, var, sp.Reals)
                domain_set = domain_set.intersection(root_dom)

    # 约束4: 移除 tan/sec/csc 奇点, cos(x) = 0 的所有点
    if expr.has(sp.tan) or expr.has(sp.sec) or expr.has(sp.csc):
            trig_singular = sp.solveset(sp.cos(var) == 0, var, sp.Reals)
            domain_set = domain_set - trig_singular

    return domain_set


def radical_equal(a, b):
    """根式专用: 立方展开判断代数恒等"""
    diff = sp.expand(a**3 - b**3)
    return sp.simplify(diff) == 0


def is_same_function(f_raw, g_raw, var):
    dom_f = get_expr_real_domain(f_raw, var)
    dom_g = get_expr_real_domain(g_raw, var)

    # ========== 修复BUG2：手动强制判定三角函数定义域不同 ==========
    trig_f = f_raw.has(sp.tan) or f_raw.has(sp.sec) or f_raw.has(sp.csc)
    trig_g = g_raw.has(sp.tan) or g_raw.has(sp.sec) or g_raw.has(sp.csc)
    if trig_f != trig_g:
        dom_equal = False
    else:
        dom_equal = dom_f == dom_g

    # ========== 修复BUG1：根式用原始表达式判等，不用化简后 ==========
    f_simp = sp.simplify(f_raw)
    g_simp = sp.simplify(g_raw)
    if f_raw.has(sp.root) or g_raw.has(sp.root):
        expr_equal = radical_equal(f_raw, g_raw)
    else:
        expr_equal = sp.simplify(f_simp - g_simp) == 0

    same = expr_equal and dom_equal
    return same, dom_f, dom_g, f_simp, g_simp

# def is_same_function(f_expr, g_expr, var):
#     """
#     判断俩个函数是否相同
#     返回: 是否相同, 定义域1, 定义域2, 化简后的f, 化简后的g
#     """
#     # 1. 求定义域
#     dom_f = get_domain(f_expr, var)
#     dom_g = get_domain(g_expr, var)

#     # 2. 符号花间判断表达式恒等
#     f_simp = sp.simplify(f_expr)
#     g_simp = sp.simplify(g_expr)

#     def radical_equal(a, b):
#         diff = sp.expand(a**3 - b**3)
#         return sp.simplify(diff) == 0

#     expr_equal = radical_equal(f_simp, g_simp)

#     # 3. 定义域是否一致
#     dom_equal = dom_f == dom_g

#     same = expr_equal and dom_equal
#     return same, dom_f, dom_g, f_simp, g_simp


# (1)  f=lg(x²) , g=2lgx
f1 = sp.log(x**2, 10)
g1 = 2 * sp.log(x, 10)
res1, df1, dg1, sf1, sg1 = is_same_function(f1, g1, x)
print(f"(1) \n是否同一函数：{res1}")
print(f"f定义域：{df1}")
print(f"g定义域：{dg1}\n")


# (2)  f2 = x , g2 = sp.sqrt(x**2)
f2 = x
g2 = sp.sqrt(x**2)
res2, df2, dg2, sf2, sg2 = is_same_function(f2, g2, x)
print(f"(2) \n是否同一函数：{res2}")
print(f"f定义域：{df2}")
print(f"g定义域：{dg2}\n")


# (3) f=三次根号(x⁴−x³) , g=x*三次根号(x−1)
f3 = sp.root(x**4 - x**3, 3)
g3 = x * sp.root(x - 1, 3)
res3, df3, dg3, sf3, sg3 = is_same_function(f3, g3, x)
print(f"(3) \n是否同一函数：{res3}")
print(f"f定义域：{df3}")
print(f"g定义域：{dg3}\n")


# (4) f=1  g=sec²x - tan²x
f4=sp.Integer(1)
g4 = sp.sec(x)**2 - sp.tan(x)**2
res4, df4, dg4, sf4, sg4 = is_same_function(f4, g4, x)
print(f"(4) \n是否同一函数: {res4}")
print(f"f定义域：{df4}")
print(f"g定义域：{dg4}\n")







# 15.  求解下列函数的自然定义域
