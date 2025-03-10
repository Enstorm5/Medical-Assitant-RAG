import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import json


with open("med.json", "r") as f:
    legal_data = json.load(f)


embedder = SentenceTransformer('all-MiniLM-L6-v2')


texts = [item['text'] for item in legal_data]
embeddings = embedder.encode(texts)


embeddings = np.array(embeddings).astype(np.float32)


nlist = 100  
quantizer = faiss.IndexFlatL2(embeddings.shape[1])  
index = faiss.IndexIVFFlat(quantizer, embeddings.shape[1], nlist, faiss.METRIC_L2)

index.train(embeddings)

index.add(embeddings)

faiss.write_index(index, "med_ivf_faiss.index")

np.save("embeddings.npy", embeddings)
