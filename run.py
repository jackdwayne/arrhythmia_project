#!/usr/bin/env python3
################################################################################
# This script will run the Arrythmia Web App from the command line. This
# script should be used for developing builds only.
################################################################################
import subprocess as sp
import os
import sys

def run_backend(current_dir, backend_source):
    """
    run_backend runs the backend source code, will return to original directory

    :param current_dir: current directory 
    :type current_dir: str
    :param backend_source: directory location of the backend source code
    :type backend_source: str
    :return: the process instance of the backend
    :rtype: Popen object
    """
    os.chdir(backend_source)
    process = sp.Popen(["python3", "manage.py", "runserver"], stdout=sp.PIPE)
    os.chdir(current_dir)
    return process

def run_frontend(current_dir, frontend_source):
    """
    run_frontend runs the frontend source code, will return to original 
    directory

    :param current_dir: current directory
    :type current_dir: str
    :param frontend_source: directory location of the frontend source code
    :type frontend_source: str
    :return: the process instance of the frontend
    :rtype: Popen object
    """
    os.chdir(frontend_source)
    process = None
    if not os.path.isdir("node_modules"):
        process = sp.Popen(["npm", "install"])
        process.wait
    process = sp.Popen(["npm", "start"], stdout=sp.PIPE)
    os.chdir(current_dir)
    return process


if __name__ == "__main__":
    print("This script will start the Arrythmia web application.")
    # Get directories
    original_dir = os.getcwd()
    frontend_start = str(original_dir) + "/frontend"
    backend_start = str(original_dir) + "/backend"
    # Keep track of all subprocesses (the backend and frontend)
    subprocesses = []
    try:
        # Run the backend and frontend
        subprocesses.append(run_backend(original_dir, backend_start))
        subprocesses.append(run_frontend(original_dir, frontend_start))
        exit_codes = [p.wait() for p in subprocesses]
    except OSError:
        # An error popped up for one of the processes, terminate everything
        [p.terminate() for p in subprocesses]
        sys.exit()
    except KeyboardInterrupt:
        # Python script is forcefully closed, terminate all processes
        [p.terminate() for p in subprocesses]
        sys.exit()
