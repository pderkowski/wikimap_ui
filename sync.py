#!/usr/bin/env python

import subprocess
import os
import shutil
import tarfile
import argparse

def copy_from_remote(remote, from_path, to_path):
    subprocess.Popen(["scp", "-r", "{}:{}".format(remote, from_path), to_path]).wait()

def clean_directory(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

    for file_name in os.listdir(directory):
        file_path = os.path.join(directory, file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print e

def unpack(path):
    print 'Extracting...'
    files = [os.path.join(path, n) for n in os.listdir(path)]
    for f in files:
        with tarfile.open(f) as tar:
            tar.extractall(path)
            os.remove(f)

def main():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--remotename', '-n', dest='remotename', type=str, default=os.environ.get("WIKIMAP_REMOTENAME", None),
        help="Specify the name of a remote server. Can also be set by WIKIMAP_REMOTENAME environment variable.")
    parser.add_argument('--remotepath', '-r', dest='remotepath', type=str, default=os.environ.get("WIKIMAP_REMOTEPATH", None),
        help="Specify a remote directory where files are located. Can also be set by WIKIMAP_REMOTEPATH environment variable.")
    parser.add_argument('--localpath', '-l', dest='localpath', type=str, default=os.environ.get("WIKIMAP_LOCALPATH", None),
        help="Specify a local directory to which files should be copied. Can also be set by WIKIMAP_LOCALPATH environment variable.")
    parser.add_argument('--subdirectory', '-s', dest='subdirectory', type=str, required=True,
        help="Specify a subdirectory that will be created inside the directory given by --localpath.")
    args = parser.parse_args()

    localpath = args.localpath
    if args.subdirectory:
        localpath = os.path.join(localpath, args.subdirectory)

    clean_directory(localpath)
    copy_from_remote(args.remotename, args.remotepath, localpath)
    unpack(localpath)

if __name__ == "__main__":
    main()
