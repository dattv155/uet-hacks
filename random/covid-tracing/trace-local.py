#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys

import mysql.connector

connection = mysql.connector.connect(host='localhost', database='backend', user='backend', password='backend')
cursor = connection.cursor()

paths = []

def q(query, params):
    cursor.execute(query, params)
    return cursor.fetchall()


def trace(f1: str, me: str, path, depth=2):
    if depth <= 0:
        return
    
    print(f"trace {depth}: {path}")
    classes = list(map(lambda x: x[4], q(
        "SELECT * FROM schedule WHERE masv = %s",
        (f1,)
    )))
    for c in classes:
        if c in path:
            continue
        participants = list(map(lambda x: x[0], q(
            "SELECT * FROM schedule WHERE malmh = %s",
            (c,)
        )))
        if any(x == me for x in participants):
            global paths
            current_path = path + (c, me)
            paths.append(current_path)
            continue
        for p in participants:
            trace(p, me, path + (c, p), depth - 1)

def print_result():
    global paths
    for p in paths:
        print(p[0], end='')
        for i in range(1, len(p)):
            if i % 2 == 0:
                print(p[i], end='')
            else:
                print(f' ---{p[i]}---> ', end='')
        print()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('python trace.py <your student ID>')
        print('  Eg. python trace.py 18020001')
        exit(0)
    f1 = '18021117'  # the first confirmed F1 in UET, change if you need to track anyone else.
    # f1 = ResultEntry('19021113')
    me = sys.argv[1]

    try:
        trace(f1, me, (f1,))
    except KeyboardInterrupt:
        pass

    print_result()
