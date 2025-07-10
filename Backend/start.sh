#!/usr/bin/env bash
cd Backend/api
uvicorn main:app --host 0.0.0.0 --port 10000
