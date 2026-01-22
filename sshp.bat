@echo off
title PostgreSQL SSH Tunnel
ssh -L 15432:127.0.0.1:5432 kwucslkm@kwucsani.iptime.org -N -v
pause
