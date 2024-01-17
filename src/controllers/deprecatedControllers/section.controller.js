import db from '../databases/models/index.js';
import '../config/environment.js';
import { default as api } from '../config/apiConfig.js';
import { slugify } from '../libraries/utility.js';

const { User, Op, Content, PortFolio, Service, Testimonial, ContactUs, Blog } = db;
