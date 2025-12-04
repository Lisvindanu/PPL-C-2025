import Avatar from "../atoms/Avatar";

export default function AboutFreelancerCard({
  avatar,
  name,
  role,
  about,
  projectCompleted = 0,
  onViewProfile,
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar src={avatar} size="md" />
        <div className="flex-1">
          <p className="font-semibold text-neutral-900">{name}</p>
          <p className="text-sm text-neutral-600">{role}</p>
          <p className="mt-2 text-sm text-neutral-700">{about}</p>
          <div className="mt-2 text-sm text-neutral-700">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#3B82F6]" />
              {projectCompleted} project completed
            </span>
          </div>

          <button
            type="button"
            onClick={onViewProfile}
            className="mt-3 text-sm font-medium text-[#1f5eff] hover:underline"
          >
            Lihat Profil Lengkap
          </button>
        </div>
      </div>
    </div>
  );
}
