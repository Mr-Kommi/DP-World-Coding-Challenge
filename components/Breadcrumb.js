import { useRouter } from 'next/router';
import Link from 'next/link';
import { Breadcrumbs, capitalize } from '@mui/material';

export default function Breadcrumb() {
    const router = useRouter();
    const pathnames = router.pathname.split('/').filter((x) => x);

    const generateLabel = (segment) => {
        if (segment.startsWith('[') && segment.endsWith(']')) {
            const paramName = segment.slice(1, -1);
            return router.query[paramName] || segment;
        }
        return capitalize(segment);
    };

    return (
        <nav className="breadcrumb">
            <Breadcrumbs aria-label="breadcrumb">
                {pathnames.map((segment, index) => {
                    const href = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const label = generateLabel(segment, index);
                    return (
                        <span key={index}>
                            <Link href={href}>
                                {label}
                            </Link>
                        </span>
                    );
                })}
            </Breadcrumbs>
        </nav>
    );
}
