//app\_components\TeamMember.jsx
import { MEMBER_DATA } from '../_utils/constants';
import MemberTile from './MemberTile';

const TeamMember = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {MEMBER_DATA.map((member, index) => (
            <MemberTile key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMember;