const AcademicTables = ({ data }) => {
  const renderTable = (project) => (
    <div className="mb-16 overflow-x-auto">
      <h3 className="text-2xl font-modius text-signal mb-6">{project.title}</h3>
      <table className="w-full min-w-[1000px] border border-graphite text-left bg-black text-steel text-sm leading-relaxed">
        <thead>
          <tr className="border-b border-graphite bg-carbon">
            <th className="p-4 border-r border-graphite w-1/5 text-signal font-bold">Objectif(s)</th>
            <th className="p-4 border-r border-graphite w-1/5 text-signal font-bold">Tâches (Principales/Secondaires)</th>
            <th className="p-4 border-r border-graphite w-1/5 text-signal font-bold">Compétences (Techniques/Transversales)</th>
            <th className="p-4 border-r border-graphite w-1/5 text-signal font-bold">Preuves de compétences</th>
            <th className="p-4 text-signal font-bold w-1/5">Pistes d'amélioration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4 border-r border-graphite align-top">
              <ul className="list-disc ml-4 space-y-2">
                {project.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </td>
            <td className="p-4 border-r border-graphite align-top">
              <strong className="text-uv block mb-1">Principales:</strong>
              <ul className="list-disc ml-4 mb-4 space-y-1">
                {project.tasks.main.map((task, i) => <li key={i}>{task}</li>)}
              </ul>
              <strong className="text-uv block mb-1">Secondaires:</strong>
              <ul className="list-disc ml-4 space-y-1">
                {project.tasks.secondary.map((task, i) => <li key={i}>{task}</li>)}
              </ul>
            </td>
            <td className="p-4 border-r border-graphite align-top">
              <strong className="text-uv block mb-1">Techniques:</strong>
              <ul className="list-disc ml-4 mb-4 space-y-1">
                {project.skills.technical.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
              <strong className="text-uv block mb-1">Transversales:</strong>
              <ul className="list-disc ml-4 space-y-1">
                {project.skills.transversal.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            </td>
            <td className="p-4 border-r border-graphite align-top">
              <ul className="list-disc ml-4 space-y-2">
                {project.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
              </ul>
            </td>
            <td className="p-4 align-top">
              <ul className="list-disc ml-4 space-y-2">
                {project.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="academic-tables-container">
      {renderTable(data.s3_project)}
      {renderTable(data.s4_project)}
    </div>
  );
};

window.AcademicTables = AcademicTables;
