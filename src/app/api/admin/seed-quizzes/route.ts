import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const quizData = [
  {
    title: 'The Living World',
    subject: 'biology',
    chapter_id: 'bio-1',
    questions: [
      { q: 'Which of the following is a defining property of all living organisms?', o: ['Growth', 'Reproduction', 'Cellular organisation', 'Metabolism'], c: 2, e: 'Cellular organisation is the only property universally present in all living organisms. Growth and reproduction can occur in non-living things too.' },
      { q: 'Taxonomy does NOT deal with:', o: ['Identification of organisms', 'Classification of organisms', 'Nomenclature of organisms', 'Inheritance patterns in organisms'], c: 3, e: 'Taxonomy deals with identification, classification, and nomenclature. Inheritance patterns are studied in genetics.' },
      { q: 'ICBN stands for:', o: ['International Code of Botanical Nomenclature', 'International Congress of Biological Names', 'Indian Code of Botanical Nomenclature', 'International Code of Biological Nomenclature'], c: 0, e: 'ICBN is the International Code of Botanical Nomenclature, now replaced by ICN.' },
      { q: 'Binomial nomenclature was introduced by:', o: ['John Ray', 'Carolus Linnaeus', 'Aristotle', 'Theophrastus'], c: 1, e: 'Carolus Linnaeus introduced the binomial system of nomenclature in Species Plantarum (1753).' },
      { q: 'A taxon is:', o: ['A unit of classification', 'A group of related species', 'A type of nomenclature', 'A rank in hierarchy'], c: 0, e: 'A taxon is a unit of classification that can represent any level: species, genus, family, order, etc.' },
      { q: 'Which is the correct sequence of taxonomic hierarchy?', o: ['Class-Phylum-Order-Family', 'Phylum-Class-Order-Family', 'Phylum-Order-Class-Family', 'Family-Order-Class-Phylum'], c: 1, e: 'The correct descending order: Kingdom > Phylum > Class > Order > Family > Genus > Species.' },
      { q: 'Species is defined as a group of organisms that:', o: ['Look similar', 'Can interbreed and produce fertile offspring', 'Live in the same habitat', 'Belong to the same genus'], c: 1, e: 'The biological species concept defines species as populations that can interbreed naturally and produce fertile offspring.' },
      { q: 'Herbarium is:', o: ['A garden of herbs', 'A storehouse of dried plant specimens', 'A collection of living plants', 'A type of botanical garden'], c: 1, e: 'A herbarium is a collection of dried, pressed, and preserved plant specimens mounted on sheets.' },
      { q: 'The term "New Systematics" was coined by:', o: ['Bentham and Hooker', 'Linnaeus', 'Julian Huxley', 'A.P. de Candolle'], c: 2, e: 'Julian Huxley coined "New Systematics" in 1940, which considers evolutionary relationships alongside morphology.' },
      { q: 'Which is the basic unit of classification?', o: ['Genus', 'Species', 'Family', 'Order'], c: 1, e: 'Species is the basic and most fundamental unit of classification in taxonomy.' },
    ]
  },
  {
    title: 'Biological Classification',
    subject: 'biology',
    chapter_id: 'bio-2',
    questions: [
      { q: 'Five kingdom classification was proposed by:', o: ['R.H. Whittaker', 'Carl Woese', 'Ernst Haeckel', 'Carolus Linnaeus'], c: 0, e: 'R.H. Whittaker proposed the five kingdom classification in 1969: Monera, Protista, Fungi, Plantae, and Animalia.' },
      { q: 'Which is NOT a criterion used by Whittaker for classification?', o: ['Cell structure', 'Body organisation', 'Mode of nutrition', 'Habitat'], c: 3, e: 'Whittaker used cell structure, body organisation, mode of nutrition, reproduction, and phylogenetic relationships. Not habitat.' },
      { q: 'Archaebacteria differ from eubacteria in:', o: ['Cell wall composition', 'Presence of nucleus', 'Mode of reproduction', 'Size of ribosomes'], c: 0, e: 'Archaebacteria have different cell wall composition (pseudomurein or no peptidoglycan) compared to eubacteria.' },
      { q: 'Cyanobacteria are classified under:', o: ['Protista', 'Plantae', 'Monera', 'Fungi'], c: 2, e: 'Cyanobacteria are prokaryotes and belong to Kingdom Monera. Also called blue-green algae.' },
      { q: 'Fungi store food in the form of:', o: ['Starch', 'Glycogen', 'Cellulose', 'Sucrose'], c: 1, e: 'Fungi store food as glycogen (like animals), not starch (like plants).' },
      { q: 'Lichens are an association between:', o: ['Algae and bacteria', 'Fungi and algae', 'Fungi and bacteria', 'Two species of fungi'], c: 1, e: 'Lichens are a symbiotic association between fungi (mycobiont) and algae or cyanobacteria (phycobiont).' },
      { q: 'Viroids differ from viruses in:', o: ['Having DNA', 'Having a protein coat', 'Lacking a protein coat', 'Being larger in size'], c: 2, e: 'Viroids are small, circular RNA molecules that lack a protein coat, unlike viruses which have a capsid.' },
      { q: 'Mycoplasma is unique because it:', o: ['Lacks a cell wall', 'Lacks DNA', 'Has a nucleus', 'Is multicellular'], c: 0, e: 'Mycoplasma is the smallest living organism that can survive without oxygen and lacks a cell wall.' },
      { q: 'Prions are:', o: ['Infectious RNA particles', 'Infectious protein particles', 'A type of virus', 'A type of bacterium'], c: 1, e: 'Prions are infectious agents made entirely of protein (no nucleic acid). They cause diseases like mad cow disease.' },
      { q: 'Which kingdom was added by Whittaker that was absent in two-kingdom classification?', o: ['Monera', 'Protista', 'Fungi', 'All of these'], c: 3, e: 'Two-kingdom system (Plantae and Animalia) lacked Monera, Protista, and Fungi. All three were added by Whittaker.' },
    ]
  },
  {
    title: 'Cell: The Unit of Life',
    subject: 'biology',
    chapter_id: 'bio-8',
    questions: [
      { q: 'Who proposed the cell theory?', o: ['Robert Hooke', 'Schleiden and Schwann', 'Rudolf Virchow', 'Leeuwenhoek'], c: 1, e: 'Schleiden (1838) and Schwann (1839) proposed the cell theory. Virchow later added "Omnis cellula e cellula".' },
      { q: 'The fluid mosaic model of plasma membrane was proposed by:', o: ['Robertson', 'Singer and Nicolson', 'Danielli and Davson', 'Overton'], c: 1, e: 'Singer and Nicolson proposed the fluid mosaic model in 1972.' },
      { q: 'Which organelle is called the "powerhouse of the cell"?', o: ['Chloroplast', 'Golgi apparatus', 'Mitochondria', 'Endoplasmic reticulum'], c: 2, e: 'Mitochondria produce ATP through oxidative phosphorylation.' },
      { q: 'The actual number of ATP molecules produced per glucose in aerobic respiration is:', o: ['38', '36', '30 to 32', '40'], c: 2, e: 'Modern biochemistry consensus: 30 to 32 ATP per glucose (not 38 as stated in older NCERT). This is a known NCERT error.' },
      { q: 'Ribosomes are composed of:', o: ['DNA and protein', 'RNA and protein', 'RNA only', 'Protein only'], c: 1, e: 'Ribosomes are made of ribosomal RNA (rRNA) and proteins. They are the sites of protein synthesis.' },
      { q: '70S ribosomes are found in:', o: ['Eukaryotic cytoplasm', 'Prokaryotic cells', 'Eukaryotic nucleus', 'Viruses'], c: 1, e: '70S ribosomes (50S + 30S) are in prokaryotes, mitochondria, and chloroplasts. Eukaryotic cytoplasm has 80S.' },
      { q: 'The Golgi apparatus was first observed by:', o: ['Robert Brown', 'Camillo Golgi', 'Robert Hooke', 'Schwann'], c: 1, e: 'Camillo Golgi first observed this organelle in 1898 in nerve cells.' },
      { q: 'Which is NOT a function of smooth endoplasmic reticulum?', o: ['Lipid synthesis', 'Detoxification', 'Protein synthesis', 'Steroid synthesis'], c: 2, e: 'Protein synthesis occurs on rough ER (which has ribosomes). Smooth ER handles lipid synthesis and detoxification.' },
      { q: 'Centrioles have which arrangement of microtubules?', o: ['9+2', '9+0', '9+3', '8+1'], c: 1, e: 'Centrioles have a 9+0 arrangement (9 triplets, no central pair). The 9+2 arrangement is in cilia and flagella.' },
      { q: 'The inner membrane of mitochondria is folded into:', o: ['Thylakoids', 'Cristae', 'Cisternae', 'Lamellae'], c: 1, e: 'Inner mitochondrial membrane forms cristae, increasing surface area for ATP synthesis.' },
    ]
  },
];

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = [];

  for (const quiz of quizData) {
    const { data: q, error: qErr } = await supabaseAdmin
      .from('quizzes')
      .insert({
        title: quiz.title,
        subject: quiz.subject,
        chapter_id: quiz.chapter_id,
        price: 0,
        is_published: true,
        total_marks: quiz.questions.length * 4,
        time_limit_minutes: quiz.questions.length * 2,
      })
      .select()
      .single();

    if (qErr) {
      results.push({ title: quiz.title, error: qErr.message });
      continue;
    }

    const questions = quiz.questions.map((question, idx) => ({
      quiz_id: q.id,
      question: question.q,
      options: question.o,
      correct_option: question.c,
      explanation: question.e,
      marks: 4,
      order_index: idx,
    }));

    const { error: insertErr } = await supabaseAdmin.from('quiz_questions').insert(questions);

    results.push({
      title: quiz.title,
      quizId: q.id,
      questionsInserted: insertErr ? 0 : questions.length,
      error: insertErr?.message,
    });
  }

  return NextResponse.json({ success: true, results });
}
