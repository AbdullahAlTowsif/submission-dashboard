import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { SubmissionRoutes } from '../modules/submission/submission.routes';
import { MentorRoutes } from '../modules/mentor/mentor.route';


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
    {
        path: '/mentor',
        route: MentorRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;
