import express from 'express';
import {
	addHomeContent,
	getPageContent,
	addHowWeWorkContent,
	addCareerContent,
	addAboutContent,
	addPortfolioContent,
	listPortfolio,
	portfolioDetails,
	editPortfolioContent,
	addService,
	listService,
	editService,
	serviceDetails,
	addTestimonial,
	listTestimonial,
	editTestimonial,
	testimonialDetails,
	listContactUs,
	addBlog,
	listBlog,
	editBlog,
	blogDetails,
	addPortfolioBannerContent,
	addSetings,
	addIndustry,
	listIndustry,
	industryDetails,
	editIndustry,
} from '../controllers/cms.controller.js';

const router = express.Router();

router.post('/add-home-content', async (req, res, next) => {
	res.send(
		await addHomeContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/add-how-we-work-content', async (req, res, next) => {
	res.send(
		await addHowWeWorkContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.post('/add-about-content', async (req, res, next) => {
	res.send(
		await addAboutContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/add-career-content', async (req, res, next) => {
	res.send(
		await addCareerContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/add-portfolio-content', async (req, res, next) => {
	res.send(
		await addPortfolioContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/list-portfolio', async (req, res, next) => {
	res.send(
		await listPortfolio({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/portfolio-details/:id', async (req, res, next) => {
	res.send(
		await portfolioDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.put('/edit-portfolio/:id', async (req, res, next) => {
	res.send(
		await editPortfolioContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/add-service', async (req, res, next) => {
	res.send(
		await addService({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/list-service', async (req, res, next) => {
	res.send(
		await listService({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/service-details/:id', async (req, res, next) => {
	res.send(
		await serviceDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.put('/edit-service/:id', async (req, res, next) => {
	res.send(
		await editService({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/add-testimonial', async (req, res, next) => {
	res.send(
		await addTestimonial({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/list-testimonial', async (req, res, next) => {
	res.send(
		await listTestimonial({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/testimonial-details/:id', async (req, res, next) => {
	res.send(
		await testimonialDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.put('/edit-testimonial/:id', async (req, res, next) => {
	res.send(
		await editTestimonial({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/list-contact', async (req, res, next) => {
	// console.log(req.socket.remoteAddress);
	res.send(
		await listContactUs({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/add-blog', async (req, res, next) => {
	res.send(
		await addBlog({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/list-blog', async (req, res, next) => {
	res.send(
		await listBlog({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.put('/edit-blog/:id', async (req, res, next) => {
	res.send(
		await editBlog({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/blog-details/:id', async (req, res, next) => {
	res.send(
		await blogDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/add-portfolio-banner-content', async (req, res, next) => {
	res.send(
		await addPortfolioBannerContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.post('/add-settings-content', async (req, res, next) => {
	res.send(
		await addSetings({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/add-industry', async (req, res, next) => {
	res.send(
		await addIndustry({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/list-industry', async (req, res, next) => {
	res.send(
		await listIndustry({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/industry-details/:id', async (req, res, next) => {
	res.send(
		await industryDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.put('/edit-industry/:id', async (req, res, next) => {
	res.send(
		await editIndustry({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/get-page-content/:page', async (req, res, next) => {
	res.send(
		await getPageContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

export default router;
