#!/usr/bin/env python3
import os,sys

import sqlite3
from sqlite3 import Error

from flask import Flask, request
from flask_restful import Resource, Api, reqparse

database = 'database.sqlite3'
blobfolder = './blobs/'

# database = ':memory:'

# Valid API_KEYS is "abcde, 12345, 1f2e3cd"
try:
    valid_api_keys = [key.strip() for key in os.environ['API_KEYS'].split(',')]
except:
    print("no valid API_KEYS in environment")
    sys.exit(1)

print(valid_api_keys)

app = Flask(__name__)
api = Api(app)

app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024 # 50Mb

### SQL HELPERS ------------------------------------------------------------

JOB_COLUMNS = ['id','name','active','owner','status','begin_date','end_date','tags','qsub','launcher']

def sql_create_connection(filename):
    """ create a database connection to a database that resides in memory
    """
    conn = None;
    try:
        conn = sqlite3.connect(filename)
        return conn
    except Error as e:
        print(e)
    return conn

def sql_create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def sql_create_clean_database(database):

    sql_create_jobs_table = """CREATE TABLE IF NOT EXISTS jobs (
                                        id INTEGER PRIMARY KEY,
                                        name TEXT NOT NULL,
                                        active INTEGER,
                                        owner TEXT,
                                        status TEXT,
                                        begin_date TEXT,
                                        end_date TEXT,
                                        tags TEXT,
                                        qsub TEXT,
                                        launcher TEXT
                            ); """

    sql_create_files_table = """CREATE TABLE IF NOT EXISTS files (
                                    sha256 TEXT PRIMARY KEY,
                                    name TEXT NOT NULL,
                                    begin_date TEXT,
                                    job_id INTEGER,
                                    FOREIGN KEY (job_id) REFERENCES jobs(id)
                                );"""


    conn = sql_create_connection(database)

    if conn is not None:
        sql_create_table(conn, sql_create_jobs_table)
        sql_create_table(conn, sql_create_files_table)
    else:
        print('cannot create database connection')

def sql_select_jobs_by_active(conn, active):
    cur = conn.cursor()
    # cur.execute("SELECT * FROM jobs WHERE active=?", (active,))
    cur.execute("SELECT * FROM jobs")
    rows = cur.fetchall()

    answerDict = []
    for row in rows:
        json = dict(map(lambda i,j : (i,j), JOB_COLUMNS, row))
        print(json)
        answerDict.append(json)

    return answerDict

def sql_insert_job(conn, job):
    sql = ''' INSERT INTO jobs(name, active)
              VALUES(:name, :active) '''

    cur = conn.cursor()
    cur.execute(sql, job)
    conn.commit()
    print(cur.lastrowid)
    return cur.lastrowid

### END SQL HELPERS ------------------------------------------------------------

def is_valid_api_key():
    return True

    # apikey = request.headers.get('Authorization')
    # if apikey in valid_api_keys:
    #     return True
    # return False


STUDENTS = {
  '1': {'name': 'Mark', 'age': 43, 'spec': 'math'},
  '2': {'name': 'Jane', 'age': 20, 'spec': 'biology'},
  '3': {'name': 'Pete', 'age': 21, 'spec': 'history'},
  '4': {'name': 'Kate', 'age': 22, 'spec': 'science'},
}

parser = reqparse.RequestParser()

class FilesList(Resource):
    def get(self):
        if not is_valid_api_key(): return "Invalid API Key", 403
        conn = sql_create_connection(database)
        with conn:
            return []

    def post(self):
        if not is_valid_api_key(): return "Invalid API Key", 403
        print("### FILES", request.files.keys())
        return 1, 201


class JobsList(Resource):
    def get(self):
        if not is_valid_api_key(): return "Invalid API Key", 403

        conn = sql_create_connection(database)
        with conn:
            active_jobs = sql_select_jobs_by_active(conn, 1) # active
            return active_jobs

    def post(self):
        if not is_valid_api_key(): return "Invalid API Key", 403

        parser.add_argument("name")
        parser.add_argument("owner")
        parser.add_argument("status")
        parser.add_argument("begin_date")
        parser.add_argument("end_date")
        parser.add_argument("qsub")
        parser.add_argument("launcher")

        job = parser.parse_args()
        job['active'] = 1

        print(job)

        conn = sql_create_connection(database)
        with conn:
            result = sql_insert_job(conn, job)
            return result, 201 # created


class Student(Resource):
    def get(self, student_id):
        if not is_valid_api_key(): return "Invalid API Key", 403

        if student_id not in STUDENTS:
            return "Not found", 404
        else:
            return STUDENTS[student_id]

    # update
    def put(self, student_id):
        if not is_valid_api_key(): return "Invalid API Key", 403

        parser.add_argument("name")
        parser.add_argument("age")
        parser.add_argument("spec")
        args = parser.parse_args()

        if student_id not in STUDENTS:
            return "Not found", 404
        else:
            student = STUDENTS[student_id]
            student["name"] = args["name"] if args["name"] is not None else student["name"]
            student["age"] = args["age"] if args["age"] is not None else student["age"]
            student["spec"] = args["spec"] if args["spec"] is not None else student["spec"]
            return student, 200

    def delete(self, student_id):
        if not is_valid_api_key(): return "Invalid API Key", 403

        if student_id not in STUDENTS:
            return "Not found", 404
        else:
            del STUDENTS[student_id]
            return '', 204

api.add_resource(FilesList, '/files/')
api.add_resource(JobsList, '/jobs/')
api.add_resource(Student, '/jobs/<job_id>')

def main():
    sql_create_clean_database(database)
    app.run(debug=True)

if __name__ == "__main__":
    main()

