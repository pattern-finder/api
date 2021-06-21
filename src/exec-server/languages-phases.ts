export class PhaseEntity {
  name: string;
  script: string;
}

export const CPP_PHASES = [
  {
    name: 'Compilation',
    script: '/usr/local/gcc-11.1.0/bin/g++ main.cpp -o out',
  },
  {
    name: 'Execution',
    script: './out',
  },
];

export const PYTHON_PHASES = [
  {
    name: 'Execution',
    script: 'python3 main.py',
  },
];

export const RUST_PHASES = [
  {
    name: 'Compilation',
    script: '/usr/local/rust-1.52.0/bin/rustc main.rs',
  },
  {
    name: 'Execution',
    script: './main',
  },
];
