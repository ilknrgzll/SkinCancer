import numpy as np
import os
import yaml
import logging
from collections import OrderedDict
from easydict import EasyDict as edict

__C = edict()
cfg = __C  # type: edict()

# Random seed
__C.SEED = None

# Dataset name
# Used by symbols factories who need to adjust for different
# inputs based on dataset used. Should be set by the script.
__C.DATASET = None

# Project directory, since config.py is supposed to be in $ROOT_DIR/core
__C.ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# tf dataset 
__C.TFDATASET = edict()
__C.TFDATASET.IMAGE_SIZE = 256
__C.TFDATASET.BATCH_SIZE = 32
__C.TFDATASET.CHANNELS = 3
__C.TFDATASET.EPOCHS = 70
__C.TFDATASET.SHUFFLE = 1000
__C.TFDATASET.SEED = 12
__C.TFDATASET.RANDOMROTATION = 0.2
__C.TFDATASET.BASEPATH = os.path.join(__C.ROOT_DIR, 'datasets')
__C.TFDATASET.PLANTVILLAGE = os.path.join(__C.ROOT_DIR, 'datasets/plantVillage_dataset/PlantVillage')
__C.TFDATASET.SERADATASET = os.path.join(__C.ROOT_DIR, 'datasets/sera_dataset')
__C.TFDATASET.TOMATOESDATASET = os.path.join(__C.ROOT_DIR, 'datasets/tomatoes_dataset')


# model structure parameters
__C.MODEL = edict()
__C.MODEL.KERNELSIZE = (3,3)
__C.MODEL.ACTIVATION = ['relu', 'softmax']
__C.MODEL.FILTERS = [32, 64]
__C.MODEL.NCLASSES = 10
__C.MODEL.OPTIMIZER = 'adam'
__C.MODEL.METRICS = ['accuracy']
__C.MODEL.FROMLOGITS = False
__C.MODEL.VERBOSE = 1

