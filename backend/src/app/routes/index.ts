import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { SubmissionRoutes } from '../modules/submission/submission.routes';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/submission',
        route: SubmissionRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;
