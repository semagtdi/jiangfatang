import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { PublicationNavbarItem } from '../generated/graphql';
import { Button } from './button';
import { Container } from './container';
import { useAppContext } from './contexts/appContext';
import HamburgerSVG from './icons/svgs/HamburgerSVG';
import { PublicationLogo } from './publication-logo';
import PublicationSidebar from './sidebar';

function hasUrl(
	navbarItem: PublicationNavbarItem,
): navbarItem is PublicationNavbarItem & { url: string } {
	return !!navbarItem.url && navbarItem.url.length > 0;
}

export const Header = () => {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/';
	const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>();
	const { publication } = useAppContext();
	const navbarItems = publication.preferences.navbarItems.filter(hasUrl);
	const visibleItems = navbarItems.slice(0, 3);
	const hiddenItems = navbarItems.slice(3);

	const toggleSidebar = () => {
		setIsSidebarVisible((prevVisibility) => !prevVisibility);
	};

	const navList = (
		<ul className="flex flex-row items-center gap-2 text-white">
			{visibleItems.map((item) => (
				<li key={item.url}>
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-200 block max-w-[200px] truncate text-ellipsis whitespace-nowrap rounded-full p-2 transition-colors hover:bg-white hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
					>
						{item.label}
					</a>
				</li>
			))}

			{hiddenItems.length > 0 && (
				<li>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<button className="transition-200 block rounded-full p-2 transition-colors hover:bg-white hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white">
								More
							</button>
						</DropdownMenu.Trigger>

						<DropdownMenu.Portal>
							<DropdownMenu.Content
								className="w-48 rounded border border-gray-300 bg-white text-neutral-950 shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
								align="end"
								sideOffset={5}
							>
								{hiddenItems.map((item) => (
									<DropdownMenu.Item asChild key={item.url}>
										<a
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											className="transition-200 block truncate p-2 transition-colors hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
										>
											{item.label}
										</a>
									</DropdownMenu.Item>
								))}
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</li>
			)}
		</ul>
	);

	return (
		<div className="border-b bg-slate-950 py-10 dark:border-neutral-800 dark:bg-neutral-900">
			<input
				type="text"
				ref={searchInputRef}
				onKeyUp={escapeSearchOnESC}
				onChange={updateSearchQuery}
				placeholder="Search blog posts…"
				className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-base focus:bg-transparent dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder:text-neutral-400 dark:hover:bg-neutral-950"
			/>
			{query && (
				<>
					{isSearching && (
						<div className="top-100 absolute left-0 z-10 mt-1 flex w-full flex-col items-stretch overflow-hidden rounded-lg border bg-white p-1 text-left text-slate-900 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
							<div className="flex animate-pulse flex-col gap-1 p-4">
								<div className="h-8 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-2/3 rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
							</div>
							<div className="flex animate-pulse flex-col gap-1 p-4">
								<div className="h-8 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-2/3 rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
							</div>
							<div className="flex animate-pulse flex-col gap-1 p-4">
								<div className="h-8 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-2/3 rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
							</div>
						</div>
					)}
					{searchResults.length > 0 && !isSearching && (
						<div className="top-100 absolute left-0 z-10 mt-1 flex w-full flex-col items-stretch overflow-hidden rounded-lg border bg-white p-1 text-left text-slate-900 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
							<h3 className="px-4 py-2 font-medium text-slate-500 dark:text-neutral-400">
								Found {searchResults.length} results
							</h3>
							<hr className="dark:border-neutral-800" />
							{searchResultsList}
						</div>
					)}
				</>
			)}
		</div>
	);
	return (
		<header className="border-b bg-slate-950 py-10 dark:border-neutral-800 dark:bg-neutral-900">
			<Container className="grid grid-cols-4 gap-5 px-5">
				<div className="col-span-2 flex flex-1 flex-row items-center gap-2 lg:col-span-1">
					<div className="lg:hidden">
						<Button
							type="outline"
							label=""
							icon={<HamburgerSVG className="h-5 w-5 stroke-current" />}
							className="rounded-xl border-transparent !px-3 !py-2 text-white hover:bg-slate-900 dark:hover:bg-neutral-800"
							onClick={toggleSidebar}
						/>

						{isSidebarVisible && (
							<PublicationSidebar navbarItems={navbarItems} toggleSidebar={toggleSidebar} />
						)}
					</div>
					<div className="hidden lg:block">
						<PublicationLogo />
					</div>
				</div>
				<div className="col-span-2 flex flex-row items-center justify-end gap-5 text-slate-300 lg:col-span-3">
					<nav className="hidden lg:block">{navList}</nav>
					<Button href={baseUrl} as="a" type="primary" label="免费法律咨询" />
				</div>
			</Container>
			<div className="mt-5 flex justify-center lg:hidden">
				<PublicationLogo />
			</div>
		</header>
	);
};
