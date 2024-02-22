import express from 'express';
import {   
	userList, 
	setPromote, 
	announcmentList, 
	contactUstList, 
	updateUserEmail, 
	updateUserPassword,
	categories,
	locations,
	subLocations,
	getAdminTransactions,
	getUserTransactions,
	deleteUser,
	userChangeStatus,
	announcementChangeStatus,
	updateCategoryDetails,
	getAnnouncementFullDetails,
	getSettings,
	updateSiteSettings,
	deleteLocation,
	deleteSubLocation,
	updateLocation,
	updateSubLocation,
	deleteContactUs,
	sendContactUsEmail
	 
 } from '../controllers/admin.controller.js';
import authPermission from '../middlewares/authPermission.js';
import { addAmountToUserWallet } from '../controllers/auth.controller.js';
import { deleteAnnouncement } from '../controllers/announcement.controller.js';
const router = express.Router();

router.use(authPermission('admin'));

router.get('/user-list', async (req, res, next) => {
	res.return(
		await userList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/get-admin-transactions', async (req, res, next) => {
	res.return(
		await getAdminTransactions({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/get-user-transactions', async (req, res, next) => {
	res.return(
		await getUserTransactions({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/delete-user', async (req, res, next) => {
	res.return(
		await deleteUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


router.get('/delete-location', async (req, res, next) => {
	res.return(
		await deleteLocation({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/delete-sub-location', async (req, res, next) => {
	res.return(
		await deleteSubLocation({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


router.get('/delete-contact-us', async (req, res, next) => {
	res.return(
		await deleteContactUs({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});









router.get('/delete-announcement', async (req, res, next) => {
	res.return(
		await deleteAnnouncement({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


router.get('/user-change-status', async (req, res, next) => {
	res.return(
		await userChangeStatus({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

//announcement-change-status

router.get('/announcement-change-status', async (req, res, next) => {
	res.return(
		await announcementChangeStatus({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});








router.get('/categories', async (req, res, next) => {
	res.return(
		await categories({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/locations', async (req, res, next) => {
	res.return(
		await locations({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/get-settings', async (req, res, next) => {
	res.return(
		await getSettings({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});




router.get('/update-user-wallet', async (req, res, next) => {
	res.send(await addAmountToUserWallet({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});

router.get('/sub-locations', async (req, res, next) => {
	res.return(
		await subLocations({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


router.get('/announcment-list', async (req, res, next) => {
	res.return(
		await announcmentList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/contact-us-list', async (req, res, next) => {
	res.return(
		await contactUstList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
})



router.get('/promote-user', async (req, res, next) => {
	res.return(
		await setPromote({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
//get-announcement-full-details

router.get('/get-announcement-full-details', async (req, res, next) => {
	res.return(
		await getAnnouncementFullDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/update-user-email', async (req, res, next) => {
	res.return(
		await updateUserEmail({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/update-site-settings', async (req, res, next) => {
	res.return(
		await updateSiteSettings({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/send-contact-us-email', async (req, res, next) => {
	res.return(
		await sendContactUsEmail({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/update-location', async (req, res, next) => {
	res.return(
		await updateLocation({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/update-sub-location', async (req, res, next) => {
	res.return(
		await updateSubLocation({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});



router.post('/update-category-details', async (req, res, next) => {
	res.return(
		await updateCategoryDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});




router.post('/update-user-password', async (req, res, next) => {
	res.return(
		await updateUserPassword({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


 
 

 

export default router;
