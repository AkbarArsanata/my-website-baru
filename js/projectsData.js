export const projects = [
    {
        id: 1,
        title: "AI Financial Predictor",
        description: "Machine learning model predicting stock trends with 94% accuracy using LSTM networks and real-time market data integration.", // Deskripsi singkat
        longDescription: "AI Financial Predictor adalah solusi cerdas berbasis machine learning yang memanfaatkan jaringan LSTM untuk menganalisis dan memprediksi tren saham secara real-time. Dengan integrasi data pasar terkini, model ini mampu memberikan prediksi dengan akurasi hingga 94%. Cocok untuk investor, analis keuangan, dan institusi yang ingin mengambil keputusan berbasis data secara cepat dan tepat. Fitur utama meliputi visualisasi tren, notifikasi perubahan signifikan, serta integrasi API untuk otomatisasi strategi investasi.", // Deskripsi panjang
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        demo: "https://chat.deepseek.com/a/chat/s/f7afb089-0915-4e0b-af13-44ae4b69b822",
        tags: ["AI", "Python", "TensorFlow", "LSTM", "Finance"],
        category: "data-ai-labs",
        date: "2023-11-15",
        featured: true
    },
    {
        id: 2,
        title: "Interactive Data Dashboard",
        description: "Modern dashboard with real-time data visualization, filtering capabilities, and export functionality built with React and D3.js.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        demo: "#",
        tags: ["React", "D3.js", "JavaScript", "Charting", "UI/UX"],
        category: "ui-showcase",
        date: "2023-08-22",
        featured: false
    },
    {
        id: 3,
        title: "Customer Segmentation Engine",
        description: "Advanced clustering model that segments customers into meaningful groups for targeted marketing campaigns.",
        image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        demo: "#",
        tags: ["Machine Learning", "Scikit-learn", "Pandas", "Clustering", "Marketing"],
        category: "data-ai-labs",
        date: "2023-05-10",
        featured: true
    },
    {
        id: 4,
        title: "E-commerce Analytics Platform",
        description: "Comprehensive analytics solution for e-commerce businesses with sales tracking and customer behavior analysis.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        demo: "#",
        tags: ["Node.js", "MongoDB", "Data Visualization", "Business Intelligence"],
        category: "end-to-end",
        date: "2023-07-18",
        featured: true
    },
    {
        id: 5,
        title: "Automated Testing Framework",
        description: "Custom testing framework that reduces QA time by 60% through intelligent test case generation.",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        demo: "#",
        tags: ["Python", "Selenium", "Automation", "QA"],
        category: "end-to-end",
        date: "2023-04-05",
        featured: false
    },
    {
        id: 6,
        title: "Natural Language Processor",
        description: "NLP pipeline for sentiment analysis and topic modeling of customer feedback with 89% accuracy.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        demo: "#",
        tags: ["NLP", "Python", "Transformers", "Sentiment Analysis"],
        category: "data-ai-labs",
        date: "2023-09-30",
        featured: true
    }
];

export const techIcons = {
    'AI': 'fas fa-brain',
    'Python': 'fab fa-python',
    'TensorFlow': 'fas fa-robot',
    'React': 'fab fa-react',
    'D3.js': 'fas fa-chart-line',
    'JavaScript': 'fab fa-js',
    'Machine Learning': 'fas fa-brain',
    'Scikit-learn': 'fas fa-robot',
    'Pandas': 'fas fa-table',
    'LSTM': 'fas fa-network-wired',
    'Finance': 'fas fa-chart-pie',
    'Charting': 'fas fa-chart-bar',
    'UI/UX': 'fas fa-paint-brush',
    'Clustering': 'fas fa-project-diagram',
    'Marketing': 'fas fa-bullseye',
    'Node.js': 'fab fa-node-js',
    'MongoDB': 'fas fa-database',
    'Business Intelligence': 'fas fa-lightbulb',
    'Automation': 'fas fa-cogs',
    'QA': 'fas fa-bug',
    'NLP': 'fas fa-language',
    'Transformers': 'fas fa-robot',
    'Sentiment Analysis': 'fas fa-smile'
};